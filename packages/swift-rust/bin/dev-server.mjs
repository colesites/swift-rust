#!/usr/bin/env node
import { existsSync, statSync, readFileSync, readdirSync, writeFileSync, unlinkSync, watch as fsWatch } from "node:fs";
import { join, resolve, extname, relative, dirname, basename, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { performance } from "node:perf_hooks";
import { errorOverlayHTML as renderErrorOverlay } from "./error-overlay.mjs";

const cwd = process.cwd();
const args = process.argv.slice(2);

function getArg(name, fallback) {
  const flag = `--${name}`;
  const eq = args.find((a) => a.startsWith(`${flag}=`));
  if (eq) return eq.slice(flag.length + 1);
  const i = args.indexOf(flag);
  if (i >= 0 && args[i + 1]) return args[i + 1];
  return fallback;
}

const port = parseInt(getArg("port", process.env.PORT || "3210"), 10);
const hostname = getArg("hostname", "0.0.0.0");

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};
const useColor = process.stdout.isTTY !== false && !process.env.NO_COLOR;
const paint = (color, s) => (useColor ? `${c[color]}${s}${c.reset}` : s);

const VERSION = "0.1.0";
const APP_DIR_CANDIDATES = [resolve(cwd, "src", "app"), resolve(cwd, "app")];
const APP_DIR = APP_DIR_CANDIDATES.find((p) => existsSync(p)) ?? resolve(cwd, "app");
const PUBLIC_DIR = resolve(cwd, "public");
const SWIFT_RUST_CONFIG = resolve(cwd, "swift-rust.config.json");

const PAGE_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js"];
const SPECIAL_FILES = new Set([
  "layout", "loading", "error", "not-found", "template", "default", "route",
  // RFC 0001 routing files
  "guard", "loader", "action", "config", "schema", "proxy", "pending",
  "revalidate", "shell", "fragment", "transition", "fallback", "prefetch",
  "error-recovery", "i18n", "rpc", "stream", "edge", "worker", "query",
  "state", "seo", "variant", "global-error",
]);

const moduleCache = new Map();
const compileTimings = new Map();
const lastCompiledAt = new Map();
const hmrClients = new Set();
let lastError = null;
const dynamicParams = new Map();

const startedAt = performance.now();
const bootTime = Date.now();

function fmtMs(ms) {
  if (ms < 1) return "<1ms";
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function logLine(parts, indent = 0) {
  const prefix = `${"│ ".repeat(indent)}`;
  process.stdout.write(`${prefix}${parts.join("")}\n`);
}

function logStartupBanner(localUrl, networkUrls) {
  const lines = [];
  lines.push("");
  lines.push(`  ${paint("cyan", "▲")} ${paint("bold", "Swift Rust")} ${paint("dim", `v${VERSION}`)}`);
  lines.push(`  ${paint("dim", "─".repeat(50))}`);
  lines.push(`  ${paint("dim", "Local:".padEnd(10))} ${paint("cyan", localUrl)}`);
  for (const url of networkUrls) {
    lines.push(`  ${paint("dim", "Network:".padEnd(10))} ${paint("cyan", url)}`);
  }
  lines.push(`  ${paint("dim", "─".repeat(50))}`);
  lines.push("");
  process.stdout.write(lines.join("\n") + "\n");
}

function logReady() {
  const total = performance.now() - startedAt;
  logLine([` ${paint("green", "✓")} ${paint("bold", "Ready")} ${paint("dim", `in ${fmtMs(total)}`)}`]);
}

function logCompile(route, ms) {
  const safe = route || "/";
  logLine([` ${paint("green", "✓")} ${paint("dim", "Compiled")} ${paint("cyan", safe)} ${paint("dim", `in ${fmtMs(ms)}`)}`]);
}

function logCompiling(route) {
  const safe = route || "/";
  logLine([` ${paint("yellow", "○")} ${paint("dim", "Compiling")} ${paint("cyan", safe)} ${paint("dim", "…")}`]);
}

function logError(err, context) {
  const msg = err?.message || String(err);
  const lines = msg.split("\n");
  logLine([` ${paint("red", "✗")} ${paint("red", context || "Error")}`]);
  for (const line of lines) {
    logLine([paint("red", line)], 1);
  }
  if (err?.stack) {
    const stackLines = err.stack.split("\n").slice(1, 6);
    for (const line of stackLines) {
      logLine([paint("dim", line.trim())], 1);
    }
  }
}

function logRequest({ method, url, status, duration, compileMs }) {
  const statusColor = status < 300 ? "green" : status < 400 ? "cyan" : status < 500 ? "yellow" : "red";
  const timing = compileMs > 0 ? ` ${paint("dim", `(${fmtMs(compileMs)} compile, ${fmtMs(duration - compileMs)} render)`)}` : "";
  logLine([
    `${paint("bold", method.padEnd(6))} `,
    `${paint("dim", url)} `,
    `${paint(statusColor, String(status))} `,
    `${paint("dim", `in ${fmtMs(duration)}`)}`,
    timing,
  ]);
}

function logHmr(file) {
  logLine([` ${paint("magenta", "↻")} ${paint("dim", "HMR")} ${paint("dim", "│")} ${paint("magenta", relative(cwd, file))}`]);
}

function logEvent(type, msg) {
  const colors = { add: "green", change: "yellow", unlink: "red" };
  const icons = { add: "+", change: "~", unlink: "-" };
  logLine([` ${paint(colors[type] || "dim", icons[type] || "?")} ${paint("dim", relative(cwd, msg))}`]);
}

function urlToRouteSegments(urlPath) {
  const clean = urlPath.split("?")[0].split("#")[0];
  if (clean === "/" || clean === "") return [];
  return clean.replace(/^\//, "").split("/").filter(Boolean);
}

function findFile(dir, basename) {
  for (const ext of PAGE_EXTENSIONS) {
    const candidate = join(dir, `${basename}${ext}`);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

function resolvePageRoute(segments) {
  if (segments.length === 0) {
    const file = findFile(APP_DIR, "page");
    if (file) return { file, params: {}, segments: [], dirChain: [APP_DIR] };
    return null;
  }
  return resolveRoute(APP_DIR, segments, 0, {}, [APP_DIR]);
}

function resolveRoute(dir, segments, idx, params, chain) {
  if (idx === segments.length) {
    const file = findFile(dir, "page");
    if (file) return { file, params, segments: segments.slice(0, idx), dirChain: chain };
    return null;
  }
  const seg = segments[idx];
  const directDir = join(dir, seg);
  if (existsSync(directDir) && statSync(directDir).isDirectory()) {
    const result = resolveRoute(directDir, segments, idx + 1, params, [...chain, directDir]);
    if (result) return result;
  }
  if (existsSync(dir) && statSync(dir).isDirectory()) {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      if (e.name.startsWith("[") && e.name.endsWith("]")) {
        const paramName = e.name.slice(1, -1);
        if (paramName.startsWith("...")) continue;
        const paramDir = join(dir, e.name);
        const newParams = { ...params, [paramName]: seg };
        const result = resolveRoute(paramDir, segments, idx + 1, newParams, [...chain, paramDir]);
        if (result) return result;
      }
    }
  }
  return null;
}

/** Resolve the leaf directory for URL segments (incl. dynamic), even when the
 *  segment has no page.tsx — used for stream.ts / rpc.ts handlers. */
function resolveLeafDir(segments) {
  return walkLeafDir(APP_DIR, segments, 0, {});
}
function walkLeafDir(dir, segments, idx, params) {
  if (idx === segments.length) return { dir, params };
  const seg = segments[idx];
  const directDir = join(dir, seg);
  if (existsSync(directDir) && statSync(directDir).isDirectory()) {
    const r = walkLeafDir(directDir, segments, idx + 1, params);
    if (r) return r;
  }
  if (existsSync(dir) && statSync(dir).isDirectory()) {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory() && e.name.startsWith("[") && e.name.endsWith("]") && !e.name.includes("...")) {
        const pn = e.name.slice(1, -1);
        const r = walkLeafDir(join(dir, e.name), segments, idx + 1, { ...params, [pn]: seg });
        if (r) return r;
      }
    }
  }
  return null;
}

/** Collect a routing file (guard/loader/action/config/schema/…) along the
 *  matched directory chain, outermost → innermost. */
function collectRouteFiles(dirChain, basename) {
  const out = [];
  for (const dir of dirChain || []) {
    const f = findFile(dir, basename);
    if (f) out.push({ file: f, dir });
  }
  return out;
}

function resolveApiRoute(segments) {
  if (segments.length === 0 || segments[0] !== "api") return null;
  const apiDir = join(APP_DIR, "api");
  if (!existsSync(apiDir)) return null;
  return resolveApi(apiDir, segments.slice(1), 0, {});
}

function resolveApi(dir, segments, idx, params) {
  if (idx === segments.length) {
    const file = findFile(dir, "route");
    if (file) return { file, params };
    return null;
  }
  const seg = segments[idx];
  const directDir = join(dir, seg);
  if (existsSync(directDir) && statSync(directDir).isDirectory()) {
    const result = resolveApi(directDir, segments, idx + 1, params);
    if (result) return result;
  }
  if (existsSync(dir) && statSync(dir).isDirectory()) {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      if (e.name.startsWith("[") && e.name.endsWith("]")) {
        const paramName = e.name.slice(1, -1);
        if (paramName.startsWith("...")) continue;
        const paramDir = join(dir, e.name);
        const newParams = { ...params, [paramName]: seg };
        const result = resolveApi(paramDir, segments, idx + 1, newParams);
        if (result) return result;
      }
    }
  }
  return null;
}

function findLayoutsFor(segments) {
  const layouts = [];
  for (let i = 0; i <= segments.length; i++) {
    const dir = i === 0 ? APP_DIR : join(APP_DIR, ...segments.slice(0, i));
    const file = findFile(dir, "layout");
    if (file) layouts.push({ file, dir });
  }
  return layouts;
}

function findNotFound(segments) {
  for (let i = segments?.length ?? 0; i >= 0; i--) {
    const dir = i === 0 ? APP_DIR : join(APP_DIR, ...segments.slice(0, i));
    const file = findFile(dir, "not-found");
    if (file) return file;
  }
  return findFile(APP_DIR, "not-found");
}

function findErrorBoundary(segments) {
  for (let i = segments?.length ?? 0; i >= 0; i--) {
    const dir = i === 0 ? APP_DIR : join(APP_DIR, ...segments.slice(0, i));
    const file = findFile(dir, "error");
    if (file) return file;
  }
  return findFile(APP_DIR, "error");
}

function findLoading(segments) {
  for (let i = segments?.length ?? 0; i >= 0; i--) {
    const dir = i === 0 ? APP_DIR : join(APP_DIR, ...segments.slice(0, i));
    const file = findFile(dir, "loading");
    if (file) return file;
  }
  return findFile(APP_DIR, "loading");
}

/** Generic: find the nearest `<basename>` file walking the URL segments up. */
function findRouteFileUp(segments, basename) {
  for (let i = segments?.length ?? 0; i >= 0; i--) {
    const dir = i === 0 ? APP_DIR : join(APP_DIR, ...segments.slice(0, i));
    const file = findFile(dir, basename);
    if (file) return file;
  }
  return findFile(APP_DIR, basename);
}

function findRouteSegmentsForDir(dir) {
  const rel = relative(APP_DIR, dir);
  if (rel === "" || rel === ".") return [];
  return rel.split(sep);
}

function bustCache(file) {
  const urlPrefix = pathToFileURL(file).href;
  for (const key of moduleCache.keys()) {
    if (key === urlPrefix || key.startsWith(`${urlPrefix}?`) || key.startsWith(`${urlPrefix}#`)) {
      moduleCache.delete(key);
    }
  }
}

// Bumped on every file change. Used to invalidate the per-render SSR bundles
// below so that edits to *transitively imported* modules (components/, lib/)
// are picked up — Bun's module cache is path-keyed and ignores ?query busting,
// so a plain re-import of the page would still serve stale child modules.
let buildGeneration = 1;

// Externalize everything that isn't the app's own source (relative imports and
// the @/ alias). React and the framework stay shared/cached; only app code is
// re-bundled, so every render reflects the latest component/lib edits.
const externalizeDepsPlugin = {
  name: "sr-externalize-deps",
  setup(build) {
    build.onResolve({ filter: /.*/ }, (args) => {
      const p = args.path;
      // App's own source (relative, absolute, or the @/ alias) → bundle fresh.
      if (p.startsWith(".") || p.startsWith("/") || p.startsWith("@/")) return undefined;
      // Everything else (react, swift-rust, node:*, @scope/*) → keep external.
      return { path: p, external: true };
    });
  },
};

const ssrBundleCache = new Map(); // file -> { gen, mod }

async function loadModuleFresh(filePath) {
  if (typeof Bun === "undefined" || typeof Bun.build !== "function") {
    return loadModule(filePath, { bust: true });
  }
  const cached = ssrBundleCache.get(filePath);
  if (cached && cached.gen === buildGeneration) return cached.mod;

  const result = await Bun.build({
    entrypoints: [filePath],
    target: "bun",
    plugins: [externalizeDepsPlugin],
  });
  if (!result.success) {
    throw new Error(result.logs.map((l) => l.message).join("\n"));
  }
  const code = await result.outputs[0].text();
  const tmp = join(dirname(filePath), `.__sr_ssr_${buildGeneration}_${Math.random().toString(36).slice(2)}.mjs`);
  writeFileSync(tmp, code);
  try {
    const mod = await import(pathToFileURL(tmp).href);
    ssrBundleCache.set(filePath, { gen: buildGeneration, mod });
    return mod;
  } finally {
    try { unlinkSync(tmp); } catch {}
  }
}

async function loadModule(filePath, { bust = false } = {}) {
  const baseUrl = pathToFileURL(filePath).href;
  const url = bust ? `${baseUrl}?t=${Date.now()}-${Math.random().toString(36).slice(2)}` : baseUrl;
  try {
    const mod = await import(url);
    moduleCache.set(url, { mod, file: filePath, loadedAt: Date.now() });
    return mod;
  } catch (err) {
    lastError = err;
    throw err;
  }
}

async function compileRoute(urlPath) {
  const start = performance.now();
  const segments = urlToRouteSegments(urlPath);
  const route = resolvePageRoute(segments);
  if (!route) {
    compileTimings.set(urlPath, performance.now() - start);
    return { ok: false, reason: "not_found", pageFile: null, layoutFile: null, params: {}, segments };
  }
  const layouts = findLayoutsFor(segments);
  const notFoundFile = findNotFound(segments);
  const errorFile = findErrorBoundary(segments);
  const loadingFile = findLoading(segments);

  if (lastCompiledAt.has(urlPath) && Date.now() - (lastCompiledAt.get(urlPath) || 0) < 100) {
    return { ok: true, pageFile: route.file, layoutFiles: layouts.map((l) => l.file), notFoundFile, errorFile, loadingFile, params: route.params, segments, cached: true };
  }

  try {
    await loadModule(route.file, { bust: true });
    for (const layout of layouts) await loadModule(layout.file, { bust: true });
    if (notFoundFile) await loadModule(notFoundFile, { bust: true });
    if (errorFile) await loadModule(errorFile, { bust: true });
    if (loadingFile) await loadModule(loadingFile, { bust: true });
  } catch (err) {
    compileTimings.set(urlPath, performance.now() - start);
    return { ok: false, reason: "compile_error", error: err, pageFile: route.file, layoutFile: layouts[0]?.file, params: route.params, segments };
  }

  const ms = performance.now() - start;
  compileTimings.set(urlPath, ms);
  lastCompiledAt.set(urlPath, Date.now());
  return { ok: true, pageFile: route.file, layoutFiles: layouts.map((l) => l.file), notFoundFile, errorFile, loadingFile, params: route.params, segments };
}

function escapeForStyleTag(css) {
  return String(css).replace(/<\/style/gi, "<\\/style").replace(/<!--/g, "<\\!--");
}

function findAppGlobalsCss() {
  for (const ext of [".css", ".scss", ".pcss"]) {
    const candidate = join(APP_DIR, `globals${ext}`);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

let postcssInstance = null;
async function getPostcss() {
  if (postcssInstance !== null) return postcssInstance;
  try {
    const candidates = [
      join(cwd, "node_modules", "postcss"),
      join(cwd, "node_modules", "postcss", "lib", "postcss.mjs"),
      join(cwd, "node_modules", "postcss", "lib", "postcss.js"),
    ];
    for (const candidate of candidates) {
      if (existsSync(candidate)) {
        const mod = await import(pathToFileURL(candidate).href);
        postcssInstance = { available: true, default: mod.default ?? mod, mod };
        return postcssInstance;
      }
    }
    const mod = await import("postcss");
    postcssInstance = { available: true, default: mod.default ?? mod, mod };
    return postcssInstance;
  } catch {
    postcssInstance = { available: false };
    return postcssInstance;
  }
}

async function loadPostcssPluginByName(name) {
  const candidates = [
    join(cwd, "node_modules", name),
    join(cwd, "..", "..", "node_modules", name),
  ];
  for (const candidate of candidates) {
    const pkgJsonPath = join(candidate, "package.json");
    if (existsSync(pkgJsonPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgJsonPath, "utf8"));
        const exportsRoot = pkg.exports?.["."] ?? {};
        const entry = exportsRoot.import ?? exportsRoot.default ?? pkg.main ?? pkg.module;
        if (typeof entry === "string") {
          const entryPath = join(candidate, entry);
          if (existsSync(entryPath)) {
            const mod = await import(pathToFileURL(entryPath).href);
            const result = mod.default ?? mod;
            logLine([` ${paint("dim", "css plugin loaded:")} ${paint("cyan", name)} ${paint("dim", "from " + relative(cwd, entryPath))}`], 1);
            return result;
          }
        }
      } catch (err) {
        logLine([` ${paint("dim", "css plugin error:")} ${paint("red", err.message)}`], 1);
      }
    }
  }
  logLine([` ${paint("dim", "css plugin not found:")} ${paint("yellow", name)}`], 1);
  return null;
}

async function loadPostcssPlugins() {
  const plugins = [];
  const tailwind = await loadPostcssPluginByName("@tailwindcss/postcss");
  if (tailwind) {
    if (typeof tailwind === "function") {
      plugins.push(tailwind());
    } else if (tailwind && typeof tailwind === "object") {
      if (typeof tailwind.postcss === "function") plugins.push(tailwind.postcss());
      else if (typeof tailwind.default === "function") plugins.push(tailwind.default());
      else if (typeof tailwind === "function") plugins.push(tailwind);
    }
  }
  return plugins;
}

async function processCss(css) {
  const pc = await getPostcss();
  if (!pc.available) {
    logLine([` ${paint("dim", "css: postcss not found, inlining raw")}`], 1);
    return css;
  }
  const plugins = await loadPostcssPlugins();
  if (plugins.length === 0) {
    logLine([` ${paint("dim", "css: no plugins loaded, inlining raw")}`], 1);
    return css;
  }
  try {
    const processor = pc.default(plugins);
    const result = await processor.process(css, { from: undefined, to: undefined });
    return result.css;
  } catch (err) {
    logLine([` ${paint("dim", "css process:")} ${paint("red", err.message)}`], 1);
    return css;
  }
}

let globalsCssCache = { file: null, mtime: 0, css: "" };
async function getProcessedGlobalsCss() {
  const file = findAppGlobalsCss();
  if (!file) return "";
  const stat = statSync(file);
  if (globalsCssCache.file === file && globalsCssCache.mtime === stat.mtimeMs) {
    return globalsCssCache.css;
  }
  const raw = readFileSync(file, "utf8");
  const processed = await processCss(raw);
  globalsCssCache = { file, mtime: stat.mtimeMs, css: processed };
  return processed;
}

const GOOGLE_FONT_FAMILIES = new Set();
let fontsScannedFromLayout = false;

const FONT_FAMILY_HINT = /\b(?:Inter|Geist|GeistMono|Geist_Mono|Roboto|Poppins|Manrope|JetBrainsMono|JetbrainsMono|FiraCode|SpaceGrotesk|PlayfairDisplay|Lora|Outfit|Sora|Figtree|PlusJakartaSans|BricolageGrotesque|Cinzel|Caveat|BebasNeue|DmSans|DmSerifDisplay|SourceCodePro|SourceCode3|IBMPlex|IbmPlex|Swift_Rust|Lora|Plus_Jakarta_Sans|Bricolage_Grotesque|Bebas_Neue|DM_Sans|DM_Serif_Display|Source_Code_Pro|IBM_Plex|JetBrains_Mono|Space_Grotesk|Plus_Jakarta_Sans|Bricolage_Grotesque)\b/g;
const FONT_HUMAN_NAME = {
  Geist: "Geist", GeistMono: "Geist Mono", Geist_Mono: "Geist Mono",
  Inter: "Inter", Roboto: "Roboto", Poppins: "Poppins", Manrope: "Manrope",
  JetBrainsMono: "JetBrains Mono", JetbrainsMono: "JetBrains Mono", JetBrains_Mono: "JetBrains Mono",
  FiraCode: "Fira Code", Fira_Code: "Fira Code",
  SpaceGrotesk: "Space Grotesk", Space_Grotesk: "Space Grotesk",
  PlayfairDisplay: "Playfair Display", Playfair_Display: "Playfair Display",
  Lora: "Lora", Outfit: "Outfit", Sora: "Sora", Figtree: "Figtree",
  PlusJakartaSans: "Plus Jakarta Sans", Plus_Jakarta_Sans: "Plus Jakarta Sans",
  BricolageGrotesque: "Bricolage Grotesque", Bricolage_Grotesque: "Bricolage Grotesque",
  Cinzel: "Cinzel", Caveat: "Caveat", BebasNeue: "Bebas Neue", Bebas_Neue: "Bebas Neue",
  DmSans: "DM Sans", DM_Sans: "DM Sans",
  DmSerifDisplay: "DM Serif Display", DM_Serif_Display: "DM Serif Display",
  SourceCodePro: "Source Code Pro", Source_Code_Pro: "Source Code Pro", SourceCode3: "Source Code Pro",
  IBMPlexSans: "IBM Plex Sans", IBM_Plex_Sans: "IBM Plex Sans",
  IbmPlexSans: "IBM Plex Sans",
  IBMPlexMono: "IBM Plex Mono", IBM_Plex_Mono: "IBM Plex Mono",
  IbmPlexMono: "IBM Plex Mono",
  IBMPlexSerif: "IBM Plex Serif", IBM_Plex_Serif: "IBM Plex Serif",
  IbmPlexSerif: "IBM Plex Serif",
};

function scanFontImportsInSource(src) {
  for (const match of src.matchAll(FONT_FAMILY_HINT)) {
    const key = match[0];
    const family = FONT_HUMAN_NAME[key];
    if (family) GOOGLE_FONT_FAMILIES.add(family);
  }
}

async function scanFontsFromLayouts() {
  if (fontsScannedFromLayout) return;
  fontsScannedFromLayout = true;
  const dirs = [APP_DIR, ...(existsSync(join(APP_DIR, "blog")) ? [join(APP_DIR, "blog")] : [])];
  for (const dir of dirs) {
    if (!existsSync(dir)) continue;
    const layoutFile = findFile(dir, "layout");
    if (layoutFile) {
      try {
        const src = readFileSync(layoutFile, "utf8");
        scanFontImportsInSource(src);
      } catch {}
    }
  }
}

function buildGoogleFontsLinkTag() {
  if (GOOGLE_FONT_FAMILIES.size === 0) return "";
  const families = Array.from(GOOGLE_FONT_FAMILIES)
    .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:wght@300..900`)
    .join("&");
  return `<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${families}&display=swap" />`;
}

function mergeMetadata(...metas) {
  const out = {};
  for (const m of metas) {
    if (!m) continue;
    if (m.title) {
      if (typeof m.title === "string") {
        out.title = m.title;
      } else if (m.title.template && m.title.default) {
        out.title = m.title.default;
      } else if (m.title.default) {
        out.title = m.title.default;
      } else if (typeof m.title === "object") {
        out.title = m.title;
      }
    }
    if (m.description) out.description = m.description;
    if (m.keywords) out.keywords = m.keywords;
    if (m.openGraph) out.openGraph = { ...(out.openGraph || {}), ...m.openGraph };
    if (m.twitter) out.twitter = { ...(out.twitter || {}), ...m.twitter };
  }
  return out;
}

function metadataToHead(meta) {
  if (!meta) return "";
  const parts = [];
  if (meta.title) {
    if (typeof meta.title === "string") parts.push(`<title>${escapeHtml(meta.title)}</title>`);
  }
  if (meta.description) parts.push(`<meta name="description" content="${escapeHtml(meta.description)}" />`);
  if (meta.keywords) {
    const kw = Array.isArray(meta.keywords) ? meta.keywords.join(", ") : meta.keywords;
    parts.push(`<meta name="keywords" content="${escapeHtml(kw)}" />`);
  }
  if (meta.openGraph) {
    if (meta.openGraph.title) parts.push(`<meta property="og:title" content="${escapeHtml(meta.openGraph.title)}" />`);
    if (meta.openGraph.description) parts.push(`<meta property="og:description" content="${escapeHtml(meta.openGraph.description)}" />`);
    if (meta.openGraph.type) parts.push(`<meta property="og:type" content="${escapeHtml(meta.openGraph.type)}" />`);
    if (meta.openGraph.url) parts.push(`<meta property="og:url" content="${escapeHtml(meta.openGraph.url)}" />`);
    if (meta.openGraph.images) {
      for (const img of meta.openGraph.images) {
        const url = typeof img === "string" ? img : img.url;
        if (url) parts.push(`<meta property="og:image" content="${escapeHtml(url)}" />`);
        if (typeof img === "object" && img) {
          if (img.width) parts.push(`<meta property="og:image:width" content="${escapeHtml(img.width)}" />`);
          if (img.height) parts.push(`<meta property="og:image:height" content="${escapeHtml(img.height)}" />`);
          if (img.alt) parts.push(`<meta property="og:image:alt" content="${escapeHtml(img.alt)}" />`);
        }
      }
    }
  }
  if (meta.twitter) {
    if (meta.twitter.card) parts.push(`<meta name="twitter:card" content="${escapeHtml(meta.twitter.card)}" />`);
    if (meta.twitter.site) parts.push(`<meta name="twitter:site" content="${escapeHtml(meta.twitter.site)}" />`);
    if (meta.twitter.creator) parts.push(`<meta name="twitter:creator" content="${escapeHtml(meta.twitter.creator)}" />`);
    if (meta.twitter.title) parts.push(`<meta name="twitter:title" content="${escapeHtml(meta.twitter.title)}" />`);
    if (meta.twitter.description) parts.push(`<meta name="twitter:description" content="${escapeHtml(meta.twitter.description)}" />`);
    if (meta.twitter.images) {
      for (const img of meta.twitter.images) {
        const url = typeof img === "string" ? img : img.url;
        if (url) parts.push(`<meta name="twitter:image" content="${escapeHtml(url)}" />`);
      }
    }
  }
  return parts.join("\n");
}

function escapeHtml(s) {
  if (s == null) return "";
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

async function resolveMetadata(layoutFiles, pageFile, params, segments) {
  const metas = [];
  for (const layoutFile of layoutFiles || []) {
    try {
      const mod = await loadModule(layoutFile, { bust: true });
      if (mod.metadata) metas.push(mod.metadata);
    } catch {}
  }
  if (pageFile) {
    try {
      const mod = await loadModule(pageFile, { bust: true });
      if (mod.generateMetadata) {
        const m = await mod.generateMetadata({ params: params || {}, searchParams: {} });
        if (m) metas.push(m);
      } else if (mod.metadata) {
        metas.push(mod.metadata);
      }
    } catch {}
  }
  return mergeMetadata(...metas);
}

async function renderToStringCompat(tree) {
  try {
    const edge = await import("react-dom/server.edge");
    if (typeof edge.renderToReadableStream === "function") {
      const stream = await edge.renderToReadableStream(tree, {
        signal: AbortSignal.timeout(10000),
      });
      if (stream.allReady) await stream.allReady;
      const reader = stream.getReader();
      let html = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        html += new TextDecoder().decode(value);
      }
      return html;
    }
  } catch (err) {
    if (err?.digest === "NOT_FOUND" || err?.name === "NotFoundError") throw err;
    if (err?.digest && String(err.digest).startsWith("REDIRECT")) throw err;
    try {
      const React = await import("react");
      const { renderToString } = await import("react-dom/server");
      return renderToString(tree);
    } catch (innerErr) {
      if (innerErr?.digest === "NOT_FOUND" || innerErr?.name === "NotFoundError") throw innerErr;
      if (innerErr?.digest && String(innerErr.digest).startsWith("REDIRECT")) throw innerErr;
      throw err;
    }
  }
  const React = await import("react");
  const { renderToString } = await import("react-dom/server");
  return renderToString(tree);
}

// ── Client islands: page-level "use client" hydration ──────────────────────
// A page whose first meaningful line is `"use client"` is bundled for the
// browser and hydrated, so interactive components (e.g. the Pdf viewer) run.
// Static pages are untouched and ship zero JS.

const islandBundleCache = new Map(); // pageFile -> { mtime, code }

export function isClientPage(file) {
  try {
    for (const raw of readFileSync(file, "utf8").split("\n")) {
      const t = raw.trim();
      if (!t || t.startsWith("//") || t.startsWith("/*") || t.startsWith("*")) continue;
      return /^["']use client["'];?$/.test(t);
    }
  } catch {}
  return false;
}

async function buildIslandBundle(pageFile) {
  if (typeof Bun === "undefined" || typeof Bun.build !== "function") {
    throw new Error("client islands require the Bun runtime");
  }
  const cached = islandBundleCache.get(pageFile);
  if (cached && cached.gen === buildGeneration) return cached.code;

  // Temp hydration entry, written next to the page so module resolution works.
  const entryPath = join(dirname(pageFile), `.__sr_island_${process.pid}_${Date.now()}.js`);
  const entry = `import { createRoot } from "react-dom/client";
import { createElement } from "react";
import Page from ${JSON.stringify(pageFile)};
const el = document.getElementById("__sr_island_root");
if (el) {
  let params = {};
  try { params = JSON.parse(el.getAttribute("data-sr-params") || "{}"); } catch {}
  // Client-render (not hydrate): "use client" pages contain client-only
  // widgets (e.g. the pdf.js viewer) whose SSR output intentionally differs
  // from the first client render, so hydration would mismatch.
  el.innerHTML = "";
  createRoot(el).render(createElement(Page, { params }));
}
`;
  writeFileSync(entryPath, entry);
  try {
    const result = await Bun.build({
      entrypoints: [entryPath],
      target: "browser",
      minify: true,
      define: { "process.env.NODE_ENV": '"production"' },
    });
    if (!result.success) {
      throw new Error(result.logs.map((l) => l.message).join("\n"));
    }
    const code = await result.outputs[0].text();
    islandBundleCache.set(pageFile, { gen: buildGeneration, code });
    return code;
  } finally {
    try { unlinkSync(entryPath); } catch {}
  }
}

// ── Routing-file error handling & convention validation ─────────────────────

class RoutingFileError extends Error {
  constructor(kind, file, cause) {
    super(`Error in ${kind} (${relative(cwd, file)}): ${cause?.message ?? cause}`);
    this.name = "RoutingFileError";
    this.kind = kind;
    this.file = file;
    this.cause = cause;
    if (cause?.stack) this.stack = cause.stack;
  }
}

const warnedRouting = new Set();
function warnRoutingFile(file, msg) {
  const key = `${file}::${msg}`;
  if (warnedRouting.has(key)) return;
  warnedRouting.add(key);
  process.stderr.write(`  ${paint("yellow", "⚠")} ${paint("dim", "[routing]")} ${msg}\n`);
}

/** Warn when routing files are placed where the router will never find them
 *  (e.g. proxy.ts at the project root, or routing files in app/ when the app
 *  uses an app/src/ directory). Helps catch a very common mistake early. */
function validateRoutingConventions() {
  const names = [...SPECIAL_FILES, "page"];
  const appRel = relative(cwd, APP_DIR) || "app";
  const srcRoot = dirname(APP_DIR);
  const usesSrc = basename(APP_DIR) === "app" && basename(srcRoot) === "src";
  const scan = (dir, label, allow = []) => {
    if (!existsSync(dir) || resolve(dir) === resolve(APP_DIR)) return;
    for (const name of names) {
      if (allow.includes(name)) continue;
      const f = findFile(dir, name);
      if (f) {
        warnRoutingFile(
          f,
          `"${name}" found in ${label} — routing files belong under "${appRel}/". ` +
            `Move ${relative(cwd, f)} into ${appRel}/ (the router only scans there).`,
        );
      }
    }
  };
  scan(cwd, "the project root");
  // proxy.ts is allowed to live at the src/ root (sibling of src/app).
  if (usesSrc) scan(srcRoot, `"src/" (outside "app/")`, ["proxy"]);
}

// ── RFC 0001 route pipeline: config → schema → guard → loader/action ────────

let routerRuntimePromise = null;
function routerRuntime() {
  if (!routerRuntimePromise) routerRuntimePromise = import("swift-rust/router").catch(() => null);
  return routerRuntimePromise;
}

function parseCookieHeader(header) {
  const map = new Map();
  for (const part of (header || "").split(";")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    const k = part.slice(0, i).trim();
    if (k) map.set(k, decodeURIComponent(part.slice(i + 1).trim()));
  }
  return map;
}
function serializeCookie(name, value, opts = {}) {
  let s = `${name}=${encodeURIComponent(value)}`;
  if (opts.maxAge != null) s += `; Max-Age=${opts.maxAge}`;
  if (opts.path) s += `; Path=${opts.path}`;
  else s += "; Path=/";
  if (opts.domain) s += `; Domain=${opts.domain}`;
  if (opts.httpOnly) s += "; HttpOnly";
  if (opts.secure) s += "; Secure";
  if (opts.sameSite) s += `; SameSite=${opts.sameSite[0].toUpperCase()}${opts.sameSite.slice(1)}`;
  return s;
}

function buildRouteCtx(req, url, params, searchParams) {
  const cookieMap = parseCookieHeader(req?.headers?.get?.("cookie") || "");
  const setCookies = [];
  const cookies = {
    get: (n) => cookieMap.get(n),
    set: (n, v, o) => { cookieMap.set(n, v); setCookies.push(serializeCookie(n, v, o)); },
    delete: (n, o) => { cookieMap.delete(n); setCookies.push(serializeCookie(n, "", { ...o, maxAge: 0 })); },
    all: () => cookieMap,
  };
  const localsMap = new Map();
  return {
    url,
    method: req?.method || "GET",
    headers: req?.headers || new Headers(),
    cookies,
    params,
    searchParams,
    runtime: "node",
    locals: { get: (k) => localsMap.get(k), set: (k, v) => localsMap.set(k, v) },
    request: req,
    __setCookies: setCookies,
  };
}

// Turn a returned RouteControl object into a thrown control the catch handles.
function applyControl(c) {
  if (!c || typeof c !== "object" || !c.kind) return;
  if (c.kind === "next") return;
  const e = new Error(`route control: ${c.kind}`);
  if (c.kind === "redirect") e.digest = `REDIRECT;${c.status || 307};${c.to}`;
  else if (c.kind === "rewrite") e.digest = `REWRITE;${c.to}`;
  else if (c.kind === "notFound") e.digest = "NOT_FOUND";
  else if (c.kind === "response") e.__response = c.response;
  else if (c.kind === "error") { throw c.error ?? new Error("route error"); }
  throw e;
}

/** Merge config.ts along the chain (inner overrides outer). */
async function readMergedConfig(chain) {
  let config = {};
  for (const { file } of collectRouteFiles(chain, "config")) {
    const mod = await loadModuleFresh(file);
    const c = mod.config ?? mod.default;
    if (c && typeof c === "object") config = { ...config, ...c, headers: { ...config.headers, ...c.headers } };
  }
  // edge.ts / worker.ts force a runtime.
  const edge = await collectFirst(chain, "edge");
  if (edge && (edge.edge || edge.default)) config.runtime = "edge";
  const worker = await collectFirst(chain, "worker");
  if (worker && (worker.default || worker.bindings)) config.runtime = "worker";
  return config;
}

async function runRoutePipeline(route, ctx) {
  const chain = route.dirChain || [];

  // proxy.ts — phase 1, outer → inner. Cheap, data-free interception
  // (Next.js calls this "proxy"; "middleware" is accepted with a warning).
  // When using a src/ directory, a root proxy lives at src/proxy.ts (sibling
  // of src/app), so it runs before any in-app proxy.
  const proxyFiles = [];
  const srcRoot = dirname(APP_DIR);
  if (basename(APP_DIR) === "app" && basename(srcRoot) === "src") {
    const rootProxy = findFile(srcRoot, "proxy");
    if (rootProxy) proxyFiles.push({ file: rootProxy, dir: srcRoot });
  }
  proxyFiles.push(...collectRouteFiles(chain, "proxy"));
  for (const { file } of proxyFiles) {
    const mod = await loadModuleFresh(file);
    const fn = mod.default ?? mod.proxy;
    if (typeof fn === "function") {
      const matcher = mod.matcher;
      const matched = !matcher || matchesMatcher(ctx.url.pathname, matcher);
      if (matched) {
        try {
          applyControl(await fn(ctx));
        } catch (e) {
          if (e?.digest || e?.__response) throw e; // control flow, re-throw
          throw new RoutingFileError("proxy", file, e);
        }
      }
    }
  }
  // Back-compat: warn if the old name is used.
  for (const { file } of collectRouteFiles(chain, "middleware")) {
    warnRoutingFile(file, `"middleware.ts" was renamed to "proxy.ts" — rename ${relative(cwd, file)}.`);
    const mod = await loadModuleFresh(file);
    const fn = mod.default ?? mod.middleware;
    if (typeof fn === "function") {
      const matcher = mod.matcher;
      if (!matcher || matchesMatcher(ctx.url.pathname, matcher)) applyControl(await fn(ctx));
    }
  }

  // config.ts — merged, applied to the response by the caller.
  const config = await readMergedConfig(chain);

  // i18n.ts — resolve the active locale into locals (cookie/header/default).
  const i18nMod = await collectFirst(chain, "i18n");
  const i18nCfg = i18nMod?.i18n ?? i18nMod?.default;
  if (i18nCfg && Array.isArray(i18nCfg.locales)) {
    let locale = i18nCfg.defaultLocale ?? i18nCfg.locales[0];
    if (typeof i18nCfg.resolve === "function") locale = (await i18nCfg.resolve(ctx)) || locale;
    else if (i18nCfg.strategy === "cookie") locale = ctx.cookies.get("locale") || locale;
    else if (i18nCfg.strategy === "header") {
      const al = ctx.headers.get?.("accept-language")?.split(",")[0]?.split("-")[0];
      if (al && i18nCfg.locales.includes(al)) locale = al;
    }
    ctx.locals.set("locale", locale);
    ctx.__locale = locale;
  }

  // schema.ts — validate/brand params + searchParams (Standard-Schema/Zod-like)
  for (const { file } of collectRouteFiles(chain, "schema")) {
    const mod = await loadModuleFresh(file);
    if (mod.params?.safeParse) {
      const r = mod.params.safeParse(ctx.params);
      if (!r.success) { const e = new Error("Invalid params"); e.__response = jsonResponse({ error: "Invalid params", issues: r.error?.issues ?? r.error }, 400); throw e; }
      Object.assign(ctx.params, r.data);
    }
    const querySpec = (await collectFirst(chain, "query"))?.query;
    const searchSchema = querySpec?.parse ?? mod.searchParams;
    if (searchSchema?.safeParse) {
      const r = searchSchema.safeParse(ctx.searchParams);
      if (r.success) Object.assign(ctx.searchParams, r.data);
    }
  }

  // guard.ts — outer → inner
  for (const { file } of collectRouteFiles(chain, "guard")) {
    const mod = await loadModuleFresh(file);
    const fn = mod.default ?? mod.guard;
    if (typeof fn === "function") {
      try {
        applyControl(await fn(ctx));
      } catch (e) {
        if (e?.digest || e?.__response) throw e;
        throw new RoutingFileError("guard", file, e);
      }
    } else if (mod.default !== undefined || mod.guard !== undefined) {
      warnRoutingFile(file, `guard.ts must export a function (default export). ${relative(cwd, file)}`);
    }
  }

  let actionData;
  // action.ts on mutating requests (leaf only)
  if (ctx.method !== "GET" && ctx.method !== "HEAD") {
    const actions = collectRouteFiles(chain, "action");
    const leaf = actions[actions.length - 1];
    if (leaf) {
      const mod = await loadModuleFresh(leaf.file);
      const fn = mod.default ?? mod.action;
      if (typeof fn === "function") {
        const actx = Object.assign({}, ctx, {
          formData: () => ctx.request.formData(),
          json: () => ctx.request.json(),
        });
        try {
          const result = await fn(actx);
          applyControl(result);
          actionData = result;
        } catch (e) {
          if (e?.digest || e?.__response) throw e;
          throw new RoutingFileError("action", leaf.file, e);
        }
      }
    }
  }

  // loader.ts — run in parallel along the chain
  const loaders = collectRouteFiles(chain, "loader");
  const loaded = await Promise.all(
    loaders.map(async ({ file, dir }) => {
      const mod = await loadModuleFresh(file);
      const fn = mod.default ?? mod.loader;
      if (typeof fn !== "function") return [dir, undefined];
      const lctx = Object.assign({}, ctx, { parent: () => undefined });
      try {
        return [dir, await fn(lctx)];
      } catch (e) {
        if (e?.digest || e?.__response) throw e;
        throw new RoutingFileError("loader", file, e);
      }
    }),
  );
  const loadersMap = {};
  for (const [dir, data] of loaded) loadersMap[relative(cwd, dir)] = data;
  const loaderData = loaded.length ? loaded[loaded.length - 1][1] : undefined;

  // state.ts — server-side state to hydrate a client store.
  let serverState;
  const stateMod = await collectFirst(chain, "state");
  const stateFn = stateMod?.default ?? stateMod?.state;
  if (typeof stateFn === "function") serverState = await stateFn(ctx);

  // seo.tsx — structured data / head injection (has loader data).
  let seoHead = "";
  const seoMod = await collectFirst(chain, "seo");
  const seoFn = seoMod?.default ?? seoMod?.seo;
  if (typeof seoFn === "function") {
    seoHead = buildSeoHead(await seoFn(Object.assign({}, ctx, { data: loaderData })));
  }

  // revalidate.ts — leaf decides cache TTL / tags.
  let revalidatePlan = config.revalidate != null ? { ttl: config.revalidate } : undefined;
  const rev = await collectFirst(chain, "revalidate");
  const revFn = rev?.default ?? rev?.revalidate;
  if (typeof revFn === "function") {
    const plan = await revFn(Object.assign({}, ctx, { data: loaderData, afterAction: ctx.method !== "GET" }));
    if (plan && typeof plan === "object") revalidatePlan = { ...revalidatePlan, ...plan };
  }

  return { actionData, loaderData, loaders: loadersMap, setCookies: ctx.__setCookies, config, revalidatePlan, serverState, seoHead };
}

function escAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
function buildSeoHead(r) {
  if (!r || typeof r !== "object") return "";
  const out = [];
  if (r.title) out.push(`<title>${escAttr(r.title)}</title>`);
  if (r.description) out.push(`<meta name="description" content="${escAttr(r.description)}" />`);
  if (r.canonical) out.push(`<link rel="canonical" href="${escAttr(r.canonical)}" />`);
  if (r.robots) out.push(`<meta name="robots" content="${escAttr(r.robots)}" />`);
  for (const [k, v] of Object.entries(r.openGraph || {})) out.push(`<meta property="og:${escAttr(k)}" content="${escAttr(v)}" />`);
  for (const a of r.alternates || []) out.push(`<link rel="alternate" hreflang="${escAttr(a.hreflang)}" href="${escAttr(a.href)}" />`);
  const jsonLd = r.jsonLd ? (Array.isArray(r.jsonLd) ? r.jsonLd : [r.jsonLd]) : [];
  for (const ld of jsonLd) out.push(`<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>`);
  return out.join("\n");
}

async function collectFirst(chain, basename) {
  const files = collectRouteFiles(chain, basename);
  if (files.length === 0) return null;
  return await loadModuleFresh(files[files.length - 1].file);
}

function matchesMatcher(pathname, matcher) {
  const list = Array.isArray(matcher) ? matcher : [matcher];
  return list.some((m) => {
    if (typeof m !== "string") return false;
    // simple glob: * → [^/]*, ** → .*
    const re = new RegExp("^" + m.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "::").replace(/\*/g, "[^/]*").replace(/::/g, ".*") + "$");
    return re.test(pathname);
  });
}

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}

function cacheControlFromPlan(plan) {
  if (!plan) return null;
  if (plan.ttl === false) return "public, max-age=31536000, immutable";
  if (plan.ttl === 0) return "no-store";
  if (typeof plan.ttl === "number") return `public, max-age=0, s-maxage=${plan.ttl}, stale-while-revalidate`;
  return null;
}

async function renderRoute(urlPath, req) {
  const segments = urlToRouteSegments(urlPath);
  const route = resolvePageRoute(segments);
  if (!route) {
    return await renderNotFound(segments);
  }
  const layouts = findLayoutsFor(segments);
  const notFoundFile = findNotFound(segments);
  const errorFile = findErrorBoundary(segments);
  const loadingFile = findLoading(segments);

  try {
    const React = await import("react");
    const url = req ? new URL(req.url) : new URL(urlPath, "http://localhost");
    const searchParams = Object.fromEntries(url.searchParams.entries());
    const ctx = buildRouteCtx(req, url, { ...route.params }, searchParams);

    // Run the RFC 0001 pipeline (config/schema/guard/loader/action).
    const pipeline = await runRoutePipeline(route, ctx);
    route.params = ctx.params; // validated/branded params flow to the page

    const runtime = await routerRuntime();
    if (runtime?.__setRouteContext) {
      runtime.__setRouteContext({
        request: ctx,
        loaderData: pipeline.loaderData,
        actionData: pipeline.actionData,
        loaders: pipeline.loaders,
      });
    }

    // variant.tsx — pick an A/B variant component (bucket from middleware/
    // cookie/assign), else fall back to page.tsx.
    let Page;
    const leafDir = (route.dirChain || [])[(route.dirChain || []).length - 1];
    const variantFile = leafDir && findFile(leafDir, "variant");
    if (variantFile) {
      const vmod = await loadModuleFresh(variantFile);
      if (vmod.variants && typeof vmod.variants === "object") {
        const bucket =
          (typeof vmod.assign === "function" ? vmod.assign(ctx) : null) ||
          ctx.locals.get("bucket") ||
          ctx.cookies.get("bucket") ||
          Object.keys(vmod.variants)[0];
        const loader = vmod.variants[bucket];
        if (typeof loader === "function") {
          const m = await loader();
          Page = m.default ?? m;
        }
      }
    }
    if (!Page) {
      const pageMod = await loadModuleFresh(route.file);
      Page = pageMod.default ?? pageMod.Page ?? pageMod.page;
    }
    if (!Page) {
      return { status: 500, html: null, error: new Error(`page ${route.file} has no default export`) };
    }

    const paramsProxy = new Proxy(route.params || {}, {
      get: (t, k) => (k in t ? t[k] : dynamicParams.get(String(k))),
    });

    const clientPage = isClientPage(route.file);
    let tree = React.createElement(Page, { params: paramsProxy });
    if (clientPage) {
      // Wrap in a hydration root so the client bundle can mount into it.
      tree = React.createElement(
        "div",
        { id: "__sr_island_root", "data-sr-params": JSON.stringify(route.params || {}) },
        tree,
      );
    }
    // Wrap the page with each segment's template then layout, innermost dir
    // first, so the nesting is layout > template > children (Next.js order).
    // template.tsx re-mounts on navigation; on the server it just wraps.
    const dirChain = route.dirChain && route.dirChain.length ? route.dirChain : [APP_DIR];
    for (let i = dirChain.length - 1; i >= 0; i--) {
      const dir = dirChain[i];
      const templateFile = findFile(dir, "template");
      if (templateFile) {
        const tmod = await loadModuleFresh(templateFile);
        const Template = tmod.default ?? tmod.Template ?? tmod.template;
        if (Template) tree = React.createElement(Template, null, tree);
      }
      const layoutFile = findFile(dir, "layout");
      if (layoutFile) {
        const layoutMod = await loadModuleFresh(layoutFile);
        const Layout = layoutMod.default ?? layoutMod.Layout ?? layoutMod.layout;
        if (Layout) tree = React.createElement(Layout, null, tree);
      }
    }
    const html = await renderToStringCompat(tree);
    if (runtime?.__setRouteContext) runtime.__setRouteContext(null);
    const metadata = await resolveMetadata(layouts.map((l) => l.file), route.file, route.params, segments);
    return { status: 200, html, metadata, error: null, clientPage, pageFile: route.file, layoutFiles: layouts.map((l) => l.file), notFoundFile, errorFile, loadingFile, segments, setCookies: pipeline.setCookies, actionData: pipeline.actionData, config: pipeline.config, revalidatePlan: pipeline.revalidatePlan, seoHead: pipeline.seoHead, serverState: pipeline.serverState };
  } catch (err) {
    const rt = await routerRuntime();
    if (rt?.__setRouteContext) rt.__setRouteContext(null);
    if (err?.__response instanceof Response) {
      return { status: err.__response.status, rawResponse: err.__response, html: null, error: null, segments };
    }
    if (err?.digest === "NOT_FOUND" || err?.name === "NotFoundError") {
      return await renderNotFound(segments);
    }
    if (err?.digest === "FORBIDDEN" || err?.name === "ForbiddenError") {
      return { status: 403, html: null, error: null, segments, rawResponse: new Response("Forbidden", { status: 403, headers: { "Content-Type": "text/plain" } }) };
    }
    if (err?.digest === "UNAUTHORIZED" || err?.name === "UnauthorizedError") {
      return { status: 401, html: null, error: null, segments, rawResponse: new Response("Unauthorized", { status: 401, headers: { "Content-Type": "text/plain" } }) };
    }
    if (err?.digest && String(err.digest).startsWith("REWRITE")) {
      const to = String(err.digest).slice("REWRITE;".length);
      return await renderRoute(to, req);
    }
    if (err?.digest && String(err.digest).startsWith("REDIRECT")) {
      const [, statusStr, ...rest] = String(err.digest).split(";");
      return { status: parseInt(statusStr, 10) || 307, redirect: rest.join(";"), html: null, error: null, segments };
    }
    if (errorFile) {
      try {
        const React = await import("react");
        const errorMod = await loadModule(errorFile, { bust: true });
        const ErrorBoundary = errorMod.default ?? errorMod.ErrorBoundary ?? errorMod.error;
        if (ErrorBoundary) {
          const html = await renderToStringCompat(React.createElement(ErrorBoundary, { error: err }));
          return { status: 500, html, metadata: null, error: err, segments, pageFile: route.file, errorFile };
        }
      } catch {}
    }
    // error-recovery.tsx — richer boundary with retry/reset (SSR: stub callbacks).
    const recoveryFile = findRouteFileUp(segments, "error-recovery");
    if (recoveryFile) {
      try {
        const React = await import("react");
        const mod = await loadModule(recoveryFile, { bust: true });
        const Recovery = mod.default ?? mod.ErrorRecovery;
        if (Recovery) {
          const html = await renderToStringCompat(
            React.createElement(Recovery, { error: err, attempt: 1, retry: () => {}, reset: () => {} }),
          );
          return { status: 500, html, metadata: null, error: err, segments, pageFile: route.file };
        }
      } catch {}
    }
    // global-error.tsx — root-level boundary. It renders its own <html>/<body>,
    // so it replaces the whole document. Only kicks in for uncaught errors when
    // no closer error/error-recovery boundary handled them.
    const globalErrorFile = findFile(APP_DIR, "global-error");
    if (globalErrorFile) {
      try {
        const React = await import("react");
        const mod = await loadModule(globalErrorFile, { bust: true });
        const GlobalError = mod.default ?? mod.GlobalError;
        if (GlobalError) {
          const inner = await renderToStringCompat(
            React.createElement(GlobalError, { error: err, reset: () => {} }),
          );
          // status:200 here only gates past the dev error overlay; the
          // rawResponse carries the real 500 to the client.
          return {
            status: 200,
            html: null,
            error: null,
            segments,
            rawResponse: new Response(`<!DOCTYPE html>${inner}`, {
              status: 500,
              headers: { "Content-Type": "text/html; charset=utf-8" },
            }),
          };
        }
      } catch {}
    }
    return { status: 500, html: null, error: err, segments, pageFile: route.file };
  }
}

async function resolvePrefetchConfig(segments) {
  const file = findRouteFileUp(segments || [], "prefetch");
  if (!file) return null;
  try {
    const mod = await loadModuleFresh(file);
    const cfg = mod.default && typeof mod.default === "object" ? mod.default : {};
    const strategy = mod.strategy ?? cfg.strategy ?? "hover";
    const out = { strategy };
    const margin = mod.margin ?? cfg.margin;
    if (margin) out.margin = String(margin);
    return out;
  } catch {
    return null;
  }
}

const pendingOverlayCache = new Map();
async function renderPendingOverlay(segments) {
  const file = findRouteFileUp(segments || [], "pending");
  if (!file) return "";
  try {
    let inner;
    const cached = pendingOverlayCache.get(file);
    if (cached && cached.gen === buildGeneration) {
      inner = cached.html;
    } else {
      const React = await import("react");
      const mod = await loadModuleFresh(file);
      const Pending = mod.default ?? mod.Pending ?? mod.pending;
      if (!Pending) return "";
      inner = await renderToStringCompat(React.createElement(Pending, {}));
      pendingOverlayCache.set(file, { gen: buildGeneration, html: inner });
    }
    return `<div id="__sr-pending" data-sr-pending hidden style="position:fixed;top:0;left:0;right:0;z-index:2147483646;pointer-events:none">${inner}</div>`;
  } catch {
    return "";
  }
}

async function renderNotFound(segments) {
  const notFoundFile = findNotFound(segments);
  if (!notFoundFile) {
    return { status: 404, html: null, error: null, segments };
  }
  try {
    const React = await import("react");
    const layouts = findLayoutsFor(segments || []);
    const mod = await loadModule(notFoundFile, { bust: true });
    const NotFound = mod.default ?? mod.NotFound ?? mod.notFound;
    if (!NotFound) {
      return { status: 404, html: null, error: null, segments };
    }
    let tree = React.createElement(NotFound);
    for (let i = layouts.length - 1; i >= 0; i--) {
      const layoutMod = await loadModule(layouts[i].file, { bust: true });
      const Layout = layoutMod.default ?? layoutMod.Layout ?? layoutMod.layout;
      if (Layout) tree = React.createElement(Layout, null, tree);
    }
    const html = await renderToStringCompat(tree);
    return { status: 404, html, metadata: null, error: null, pageFile: notFoundFile, layoutFiles: layouts.map((l) => l.file), segments };
  } catch (err) {
    return { status: 404, html: null, error: err, segments };
  }
}

function errorOverlayHTML(message, stack, extra) {
  return renderErrorOverlay({ message, stack, ...(extra || {}) });
}

// Metadata icon files looked up at the root of the app directory (app/ or
// app/src/), Next.js App Router style. Found files are served from the site
// root and auto-linked in <head>.
const APP_ICON_FILES = ["favicon.ico", "favicon.svg", "icon.svg", "icon.png", "apple-icon.png"];

function discoverAppIcons() {
  const icons = [];
  for (const name of APP_ICON_FILES) {
    const file = join(APP_DIR, name);
    if (existsSync(file) && statSync(file).isFile()) icons.push({ name, file });
  }
  return icons;
}

function buildAppIconsLinkTags() {
  return discoverAppIcons()
    .map(({ name }) => {
      const ext = extname(name).toLowerCase();
      if (name.startsWith("apple-icon")) return `<link rel="apple-touch-icon" href="/${name}" />`;
      if (ext === ".ico") return `<link rel="icon" href="/${name}" sizes="any" />`;
      if (ext === ".svg") return `<link rel="icon" href="/${name}" type="image/svg+xml" />`;
      return `<link rel="icon" href="/${name}" />`;
    })
    .join("\n");
}

async function buildHead(head) {
  const css = await getProcessedGlobalsCss();
  const fontLink = buildGoogleFontsLinkTag();
  return [
    head || "",
    buildAppIconsLinkTags(),
    fontLink,
    css ? `<style data-swift-rust-globals>${escapeForStyleTag(css)}</style>` : "",
  ].filter(Boolean).join("\n");
}

function wrapInDocument({ head, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
${head || ""}
<script src="/_swift-rust/hmr-client.js" defer></script>
</head>
<body>${body}</body>
</html>`;
}

async function wrapInDocumentAsync({ head, body }) {
  const fullHead = await buildHead(head);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
${fullHead}
<script src="/_swift-rust/navigator.js" defer></script>
<script src="/_swift-rust/hmr-client.js" defer></script>
</head>
<body>${body}</body>
</html>`;
}

async function tryHmrClient() {
  try {
    const file = join(dirname(new URL(import.meta.url).pathname), "runtime", "hmr-client.js");
    return readFileSync(file, "utf8");
  } catch {
    return null;
  }
}

function readNavigatorClient() {
  try {
    const file = join(dirname(new URL(import.meta.url).pathname), "runtime", "navigator.js");
    return readFileSync(file, "utf8");
  } catch {
    return null;
  }
}

function shouldIgnoreFile(filename) {
  if (!filename) return true;
  const base = filename.split(sep).pop();
  if (!base) return true;
  if (base.startsWith(".")) return true;
  if (base.endsWith(".bak") || base.endsWith(".tmp") || base.endsWith("~")) return true;
  if (base === "node_modules") return true;
  return false;
}

function setupWatcher() {
  if (!existsSync(APP_DIR)) return;
  const watchers = new Map();

  function walk(dir) {
    if (watchers.has(dir)) return;
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        if (e.isDirectory() && !e.name.startsWith(".") && e.name !== "node_modules") {
          walk(join(dir, e.name));
        }
      }
      let debounce;
      const w = fsWatch(dir, (event, filename) => {
        if (shouldIgnoreFile(filename)) return;
        const full = join(dir, filename.toString());
        if (debounce) clearTimeout(debounce);
        debounce = setTimeout(() => {
          try {
            const s = statSync(full);
            if (s.isDirectory()) {
              walk(full);
              return;
            }
          } catch {}
          logEvent("change", full);
          buildGeneration++;
          bustCache(full);
          if (full.includes(`${sep}globals.${"css"}`)) {
            globalsCssCache = { file: null, mtime: 0, css: "" };
          }
          if (full.endsWith(`${sep}layout.tsx`) || full.endsWith(`${sep}layout.ts`)) {
            fontsScannedFromLayout = false;
            GOOGLE_FONT_FAMILIES.clear();
          }
          const payload = { type: "reload", file: relative(cwd, full), at: Date.now() };
          for (const send of hmrClients) {
            try {
              send(JSON.stringify({ event: "change", data: payload }));
            } catch {}
          }
          logHmr(full);
        }, 30);
      });
      watchers.set(dir, w);
    } catch (err) {
      logLine([` ${paint("dim", "watch error:")} ${paint("red", err.message)}`], 1);
    }
  }
  walk(APP_DIR);
  // Also watch sibling source dirs that pages/layouts import from — without
  // this, edits to components/, lib/, etc. never trigger a reload.
  for (const extra of ["components", "lib", "app"]) {
    const p = resolve(cwd, extra);
    if (existsSync(p)) walk(p);
  }
}

const networkUrls = [];
async function detectNetworkUrls() {
  const { networkInterfaces } = await import("node:os");
  const ifaces = networkInterfaces();
  for (const [name, list] of Object.entries(ifaces)) {
    for (const iface of list || []) {
      if (iface.family === "IPv4" && !iface.internal) {
        networkUrls.push(`http://${iface.address}:${port}`);
      }
    }
  }
}

async function checkAppDir() {
  if (!existsSync(APP_DIR)) {
    process.stdout.write(`\n  ${paint("red", "✗")} ${paint("bold", "No app/ directory found")}\n`);
    process.stdout.write(`  ${paint("dim", `Create ${paint("cyan", "app/page.tsx")} to get started`)}\n\n`);
    process.exit(1);
  }
}

let serverHandle = null;

async function handleRequest(req, res) {
  const reqStart = performance.now();
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const method = req.method || "GET";

  if (pathname === "/_swift-rust/hmr") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });
    res.write(": ping\n\n");
    const send = (data) => res.write(`data: ${data}\n\n`);
    hmrClients.add(send);
    const ping = setInterval(() => {
      try {
        res.write(": ping\n\n");
      } catch {
        clearInterval(ping);
      }
    }, 15000);
    req.on("close", () => {
      hmrClients.delete(send);
      clearInterval(ping);
    });
    return;
  }

  if (pathname === "/sw.js" || pathname === "/sw.js.map") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (pathname === "/_swift-rust/info") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ version: VERSION, appDir: relative(cwd, APP_DIR), port, uptime: Date.now() - bootTime }));
    return;
  }

  if (pathname === "/_swift-rust/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("ok");
    return;
  }

  if (method !== "GET" && method !== "HEAD") {
    res.writeHead(405);
    res.end("Method not allowed");
    return;
  }

  if (pathname.startsWith("/_swift-rust/")) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  if (pathname === "/_swift-rust/hmr-client.js") {
    const client = await tryHmrClient();
    if (client) {
      res.writeHead(200, { "Content-Type": "application/javascript" });
      res.end(client);
      return;
    }
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  if (pathname.startsWith("/_swift-rust/fonts/")) {
    const fontPath = join(
      import.meta.dirname,
      "..",
      "..",
      "..",
      "packages",
      "font",
      "src",
      "local",
      decodeURIComponent(pathname.replace("/_swift-rust/fonts/", ""))
    );
    if (existsSync(fontPath) && statSync(fontPath).isFile()) {
      const ext = extname(fontPath).toLowerCase();
      const mime = { ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".otf": "font/otf" }[ext] ?? "application/octet-stream";
      res.writeHead(200, { "Content-Type": mime, "Cache-Control": "public, max-age=31536000, immutable" });
      res.end(readFileSync(fontPath));
      return;
    }
    res.writeHead(404);
    res.end("Font not found");
    return;
  }

  if (pathname === "/_swift-rust/image") {
    const target = url.searchParams.get("url");
    const w = parseInt(url.searchParams.get("w") || "0", 10);
    if (!target) {
      res.writeHead(400);
      res.end("Missing url");
      return;
    }
    const decoded = decodeURIComponent(target);
    if (existsSync(PUBLIC_DIR)) {
      const safe = decoded.replace(/\.\.+/g, "").replace(/^\/+/, "");
      const candidate = join(PUBLIC_DIR, safe);
      if (existsSync(candidate) && statSync(candidate).isFile()) {
        const ext = extname(candidate).toLowerCase();
        const mime = MIME[ext] || "application/octet-stream";
        const buf = readFileSync(candidate);
        res.writeHead(200, {
          "Content-Type": mime,
          "Cache-Control": "public, max-age=3600",
          "X-Swift-Rust-Image-Optimization": "passthrough",
          ...(w > 0 ? { "X-Swift-Rust-Image-Width": String(w) } : {}),
        });
        res.end(buf);
        return;
      }
    }
    res.writeHead(404);
    res.end("Image not found");
    return;
  }

  if (pathname.startsWith("/_static/") || pathname.startsWith("/__swift-rust/")) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  // App-directory metadata icons (app/favicon.ico, app/icon.svg, …) served
  // from the site root, Next.js style.
  {
    const iconName = pathname.replace(/^\/+/, "");
    if (APP_ICON_FILES.includes(iconName)) {
      const candidate = join(APP_DIR, iconName);
      if (existsSync(candidate) && statSync(candidate).isFile()) {
        const ext = extname(candidate).toLowerCase();
        const mime = { ".ico": "image/x-icon", ".svg": "image/svg+xml", ".png": "image/png" }[ext] || "application/octet-stream";
        res.writeHead(200, { "Content-Type": mime });
        res.end(readFileSync(candidate));
        return;
      }
    }
  }

  if (existsSync(PUBLIC_DIR)) {
    const safe = pathname.replace(/\.\.+/g, "").replace(/^\/+/, "");
    const candidate = join(PUBLIC_DIR, safe);
    if (existsSync(candidate) && statSync(candidate).isFile()) {
      const ext = extname(candidate).toLowerCase();
      const mime = {
        ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
        ".gif": "image/gif", ".webp": "image/webp", ".avif": "image/avif",
        ".svg": "image/svg+xml", ".ico": "image/x-icon",
        ".css": "text/css", ".js": "application/javascript", ".mjs": "application/javascript",
        ".json": "application/json", ".txt": "text/plain", ".woff": "font/woff",
        ".woff2": "font/woff2", ".ttf": "font/ttf", ".otf": "font/otf",
        ".mp4": "video/mp4", ".webm": "video/webm", ".mp3": "audio/mpeg",
      }[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": mime });
      res.end(readFileSync(candidate));
      return;
    }
  }

  const compileStart = performance.now();
  const compileResult = await compileRoute(pathname);
  const compileMs = performance.now() - compileStart;

  if (compileResult.ok && !compileResult.cached) {
    logCompile(pathname, compileMs);
  }

  if (!compileResult.ok) {
    if (compileResult.reason === "not_found") {
      const total = performance.now() - reqStart;
      logRequest({ method, url: pathname, status: 404, duration: total, compileMs: 0 });
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end(`404 not found: ${pathname}`);
      return;
    }
    if (compileResult.reason === "compile_error") {
      const err = compileResult.error;
      logError(err, `Failed to compile ${pathname}`);
      const total = performance.now() - reqStart;
      logRequest({ method, url: pathname, status: 500, duration: total, compileMs });
      res.writeHead(500, { "Content-Type": "text/html" });
      res.end(errorOverlayHTML(err?.message || "Compilation error", err?.stack || ""));
      for (const send of hmrClients) {
        try {
          send(JSON.stringify({ event: "change", data: { type: "error", message: err?.message || "compile error" } }));
        } catch {}
      }
      return;
    }
  }

  const renderStart = performance.now();
  const renderResult = await renderRoute(pathname, req);
  const renderMs = performance.now() - renderStart;
  const total = performance.now() - reqStart;

  if (renderResult.status === 500) {
    logError(renderResult.error, `Failed to render ${pathname}`);
    logRequest({ method, url: pathname, status: 500, duration: total, compileMs });
    res.writeHead(500, { "Content-Type": "text/html" });
    res.end(errorOverlayHTML(renderResult.error?.message || "Render error", renderResult.error?.stack || ""));
    for (const send of hmrClients) {
      try {
        send(JSON.stringify({ event: "change", data: { type: "error", message: renderResult.error?.message || "render error" } }));
      } catch {}
    }
    return;
  }

  if (renderResult.status === 404) {
    logRequest({ method, url: pathname, status: 404, duration: total, compileMs: 0 });
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end(errorOverlayHTML("Not found", `No page found for ${pathname}`));
    return;
  }

  logRequest({ method, url: pathname, status: 200, duration: total, compileMs });
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(await wrapInDocumentAsync({ head: "", body: renderResult.html || "" }));
}

async function handleFetch(req) {
  const reqStart = performance.now();
  const url = new URL(req.url);
  const pathname = url.pathname;
  const method = req.method || "GET";

  if (pathname === "/_swift-rust/hmr") {
    const stream = new ReadableStream({
      start(controller) {
        const enc = new TextEncoder();
        controller.enqueue(enc.encode(": ping\n\n"));
        const send = (data) => controller.enqueue(enc.encode(`data: ${data}\n\n`));
        hmrClients.add(send);
        const ping = setInterval(() => {
          try {
            controller.enqueue(enc.encode(": ping\n\n"));
          } catch {
            clearInterval(ping);
            hmrClients.delete(send);
          }
        }, 15000);
        req.signal?.addEventListener("abort", () => {
          hmrClients.delete(send);
          clearInterval(ping);
          try {
            controller.close();
          } catch {}
        });
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  }

  if (pathname === "/sw.js" || pathname === "/sw.js.map") {
    return new Response(null, { status: 204 });
  }

  if (pathname === "/_swift-rust/info") {
    return Response.json({ version: VERSION, appDir: relative(cwd, APP_DIR), port, uptime: Date.now() - bootTime });
  }

  if (pathname === "/_swift-rust/health") {
    return new Response("ok", { headers: { "Content-Type": "text/plain" } });
  }

  if (pathname === "/_swift-rust/hmr-client.js") {
    const client = await tryHmrClient();
    if (client) {
      return new Response(client, { headers: { "Content-Type": "application/javascript" } });
    }
    return new Response("Not found", { status: 404 });
  }

  if (pathname === "/_swift-rust/navigator.js") {
    const client = readNavigatorClient();
    if (client) {
      return new Response(client, { headers: { "Content-Type": "application/javascript; charset=utf-8" } });
    }
    return new Response("// navigator unavailable", { status: 404, headers: { "Content-Type": "application/javascript" } });
  }

  if (pathname === "/_swift-rust/image") {
    const target = url.searchParams.get("url");
    const w = parseInt(url.searchParams.get("w") || "0", 10);
    if (!target) return new Response("Missing url", { status: 400 });
    const decoded = decodeURIComponent(target);
    if (existsSync(PUBLIC_DIR)) {
      const safe = decoded.replace(/\.\.+/g, "").replace(/^\/+/, "");
      const candidate = join(PUBLIC_DIR, safe);
      if (existsSync(candidate) && statSync(candidate).isFile()) {
        const ext = extname(candidate).toLowerCase();
        const mime = MIME[ext] || "application/octet-stream";
        const file = Bun?.file ? Bun.file(candidate) : readFileSync(candidate);
        const headers = {
          "Content-Type": mime,
          "Cache-Control": "public, max-age=3600",
          "X-Swift-Rust-Image-Optimization": "passthrough",
          ...(w > 0 ? { "X-Swift-Rust-Image-Width": String(w) } : {}),
        };
        const total = performance.now() - reqStart;
        logRequest({ method, url: pathname, status: 200, duration: total, compileMs: 0 });
        return new Response(file, { headers });
      }
    }
    return new Response("Image not found", { status: 404 });
  }

  // Client-island hydration bundle for a "use client" page.
  if (pathname === "/_swift-rust/island.js") {
    const p = url.searchParams.get("p");
    if (p && existsSync(p)) {
      try {
        const code = await buildIslandBundle(p);
        return new Response(code, {
          headers: { "Content-Type": "application/javascript; charset=utf-8", "Cache-Control": "no-cache" },
        });
      } catch (e) {
        logError(e, `island bundle failed for ${p}`);
        return new Response(`/* island build error: ${String(e?.message || e).replace(/\*\//g, "* /")} */`, {
          status: 500,
          headers: { "Content-Type": "application/javascript; charset=utf-8" },
        });
      }
    }
    return new Response("// island not found", { status: 404, headers: { "Content-Type": "application/javascript" } });
  }

  if (pathname.startsWith("/_swift-rust/")) {
    return new Response("Not found", { status: 404 });
  }

  // App-directory metadata icons (app/favicon.ico, app/favicon.svg, …) served
  // from the site root, Next.js style.
  {
    const iconName = pathname.replace(/^\/+/, "");
    if (APP_ICON_FILES.includes(iconName)) {
      const candidate = join(APP_DIR, iconName);
      if (existsSync(candidate) && statSync(candidate).isFile()) {
        const ext = extname(candidate).toLowerCase();
        const mime =
          { ".ico": "image/x-icon", ".svg": "image/svg+xml", ".png": "image/png" }[ext] ||
          "application/octet-stream";
        const file = Bun?.file ? Bun.file(candidate) : readFileSync(candidate);
        logRequest({ method, url: pathname, status: 200, duration: performance.now() - reqStart, compileMs: 0 });
        return new Response(file, { headers: { "Content-Type": mime } });
      }
    }
  }

  if (existsSync(PUBLIC_DIR)) {
    const safe = pathname.replace(/\.\.+/g, "").replace(/^\/+/, "");
    const candidate = join(PUBLIC_DIR, safe);
    if (existsSync(candidate) && statSync(candidate).isFile()) {
      const ext = extname(candidate).toLowerCase();
      const mime = MIME[ext] || "application/octet-stream";
      const file = Bun?.file ? Bun.file(candidate) : readFileSync(candidate);
      const total = performance.now() - reqStart;
      logRequest({ method, url: pathname, status: 200, duration: total, compileMs: 0 });
      return new Response(file, { headers: { "Content-Type": mime } });
    }
  }

  const segments = urlToRouteSegments(pathname);
  if (segments[0] === "api") {
    return await handleApiRoute(req, segments, method, reqStart);
  }

  // rpc.ts / stream.ts handlers (leaf, route.ts-like).
  {
    const leaf = resolveLeafDir(segments);
    if (leaf) {
      const sp = Object.fromEntries(url.searchParams.entries());
      const baseCtx = buildRouteCtx(req, url, leaf.params, sp);
      const rpcFile = findFile(leaf.dir, "rpc");
      if (rpcFile) {
        try {
          const mod = await loadModuleFresh(rpcFile);
          const procs = mod.procedures ?? mod.default;
          if (procs && typeof procs === "object") {
            if (method === "POST") {
              const body = await req.json().catch(() => ({}));
              const proc = procs[body.procedure];
              if (!proc) return jsonResponse({ error: `Unknown procedure: ${body.procedure}` }, 404);
              let input = body.input;
              if (proc.input?.safeParse) {
                const r = proc.input.safeParse(input);
                if (!r.success) return jsonResponse({ error: "Invalid input", issues: r.error?.issues ?? r.error }, 400);
                input = r.data;
              }
              return jsonResponse({ data: await proc.handler(input, baseCtx) });
            }
            if (method === "GET") return jsonResponse({ procedures: Object.keys(procs) });
          }
        } catch (e) {
          return jsonResponse({ error: String(e?.message || e) }, 500);
        }
      }
      const streamFile = findFile(leaf.dir, "stream");
      if (streamFile && !findFile(leaf.dir, "page")) {
        try {
          const mod = await loadModuleFresh(streamFile);
          const fn = mod.default ?? mod.stream;
          if (typeof fn === "function") {
            const result = await fn(baseCtx);
            if (result instanceof Response) return result;
            return new Response(result, {
              headers: { "Content-Type": mod.contentType || "text/event-stream", "Cache-Control": "no-cache" },
            });
          }
        } catch (e) {
          return new Response(String(e?.message || e), { status: 500 });
        }
      }
    }
  }

  // Non-GET requests are allowed to reach the page render so action.ts can run;
  // pages without an action simply ignore the body.
  const ALLOWED_METHODS = new Set(["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"]);
  if (!ALLOWED_METHODS.has(method)) {
    return new Response("Method not allowed", { status: 405 });
  }

  const compileStart = performance.now();
  const compileResult = await compileRoute(pathname);
  const compileMs = performance.now() - compileStart;

  if (compileResult.ok && !compileResult.cached) {
    logCompile(pathname, compileMs);
  }

  if (!compileResult.ok) {
    if (compileResult.reason === "not_found") {
      const notFoundResult = await renderNotFound(segments);
      const total = performance.now() - reqStart;
      const status = notFoundResult.html ? 404 : 404;
      logRequest({ method, url: pathname, status, duration: total, compileMs: 0 });
      if (notFoundResult.html) {
        return new Response(await wrapInDocumentAsync({ head: "", body: notFoundResult.html }), {
          status: 404,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }
      return new Response(errorOverlayHTML("Not found", `No page found for ${pathname}`), {
        status: 404,
        headers: { "Content-Type": "text/html" },
      });
    }
    if (compileResult.reason === "compile_error") {
      const err = compileResult.error;
      logError(err, `Failed to compile ${pathname}`);
      const total = performance.now() - reqStart;
      logRequest({ method, url: pathname, status: 500, duration: total, compileMs });
      const overlay = errorOverlayHTML(err?.message || "Compilation error", err?.stack || "");
      for (const send of hmrClients) {
        try {
          send(JSON.stringify({ event: "change", data: { type: "error", message: err?.message || "compile error" } }));
        } catch {}
      }
      return new Response(overlay, { status: 500, headers: { "Content-Type": "text/html" } });
    }
  }

  const renderStart = performance.now();
  const renderResult = await renderRoute(pathname, req);
  const renderMs = performance.now() - renderStart;
  const total = performance.now() - reqStart;

  if (renderResult.status === 500) {
    logError(renderResult.error, `Failed to render ${pathname}`);
    logRequest({ method, url: pathname, status: 500, duration: total, compileMs });
    const overlay = errorOverlayHTML(renderResult.error?.message || "Render error", renderResult.error?.stack || "");
    for (const send of hmrClients) {
      try {
        send(JSON.stringify({ event: "change", data: { type: "error", message: renderResult.error?.message || "render error" } }));
      } catch {}
    }
    return new Response(overlay, { status: 500, headers: { "Content-Type": "text/html" } });
  }

  if (renderResult.status === 404) {
    logRequest({ method, url: pathname, status: 404, duration: total, compileMs: 0 });
    if (renderResult.html) {
      return new Response(await wrapInDocumentAsync({ head: "", body: renderResult.html }), {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }
    return new Response(errorOverlayHTML("Not found", `No page found for ${pathname}`), {
      status: 404,
      headers: { "Content-Type": "text/html" },
    });
  }

  if (renderResult.redirect) {
    logRequest({ method, url: pathname, status: renderResult.status, duration: total, compileMs });
    const rh = new Headers({ Location: renderResult.redirect });
    for (const c of renderResult.setCookies || []) rh.append("Set-Cookie", c);
    return new Response(null, { status: renderResult.status, headers: rh });
  }

  // Raw Response from a guard/action (RouteControl response, 401, 403, …).
  if (renderResult.rawResponse instanceof Response) {
    logRequest({ method, url: pathname, status: renderResult.rawResponse.status, duration: total, compileMs });
    const r = renderResult.rawResponse;
    for (const c of renderResult.setCookies || []) r.headers.append("Set-Cookie", c);
    return r;
  }

  logRequest({ method, url: pathname, status: 200, duration: total, compileMs });
  await scanFontsFromLayouts();
  // seo.tsx head + metadata head
  const headExtra = [metadataToHead(renderResult.metadata), renderResult.seoHead || ""].filter(Boolean).join("\n");
  let doc = await wrapInDocumentAsync({ head: headExtra, body: renderResult.html || "" });
  // state.ts → window.__SR_STATE__ for client stores
  if (renderResult.serverState !== undefined) {
    const json = JSON.stringify(renderResult.serverState).replace(/</g, "\\u003c");
    doc = doc.replace("</body>", `<script>window.__SR_STATE__=${json}</script>\n</body>`);
  }
  if (renderResult.clientPage && renderResult.pageFile) {
    const src = `/_swift-rust/island.js?p=${encodeURIComponent(renderResult.pageFile)}`;
    doc = doc.replace("</body>", `<script type="module" src="${src}"></script>\n</body>`);
  }
  // pending.tsx → hidden overlay the client navigator reveals while a
  // navigation is in flight (see runtime/navigator.js).
  const pendingOverlay = await renderPendingOverlay(renderResult.segments);
  if (pendingOverlay) doc = doc.replace("</body>", `${pendingOverlay}\n</body>`);
  // prefetch.ts → client prefetch strategy for the navigator.
  const prefetchCfg = await resolvePrefetchConfig(renderResult.segments);
  if (prefetchCfg) {
    const json = JSON.stringify(prefetchCfg).replace(/</g, "\\u003c");
    doc = doc.replace("</body>", `<script>window.__SR_PREFETCH__=${json}</script>\n</body>`);
  }
  const headers = new Headers({ "Content-Type": "text/html; charset=utf-8" });
  for (const c of renderResult.setCookies || []) headers.append("Set-Cookie", c);
  // config.ts headers
  for (const [k, v] of Object.entries(renderResult.config?.headers || {})) headers.set(k, String(v));
  // revalidate.ts → Cache-Control + cache tags
  const cc = cacheControlFromPlan(renderResult.revalidatePlan);
  if (cc) headers.set("Cache-Control", cc);
  const tags = renderResult.revalidatePlan?.tags || renderResult.revalidatePlan?.invalidate;
  if (Array.isArray(tags) && tags.length) headers.set("x-vercel-cache-tags", tags.join(","));
  return new Response(doc, { status: 200, headers });
}

async function handleApiRoute(req, segments, method, reqStart) {
  const route = resolveApiRoute(segments);
  if (!route) {
    const total = performance.now() - reqStart;
    logRequest({ method, url: "/" + segments.join("/"), status: 404, duration: total, compileMs: 0 });
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
  const handlerName = method.toUpperCase();
  try {
    const mod = await loadModule(route.file, { bust: true });
    const handler = mod[handlerName] || mod[method.toLowerCase()];
    if (typeof handler !== "function") {
      const total = performance.now() - reqStart;
      logRequest({ method, url: "/" + segments.join("/"), status: 405, duration: total, compileMs: 0 });
      return new Response(JSON.stringify({ error: `Method ${method} not allowed` }), {
        status: 405,
        headers: { "Content-Type": "application/json", Allow: Object.keys(mod).filter((k) => typeof mod[k] === "function" && k === k.toUpperCase()).join(", ") },
      });
    }
    const url = new URL(req.url);
    const body = method === "GET" || method === "HEAD" ? null : await req.text().catch(() => null);
    let parsedBody = null;
    if (body) {
      try {
        parsedBody = JSON.parse(body);
      } catch {
        parsedBody = body;
      }
    }
    const result = await handler({
      request: req,
      params: route.params,
      query: Object.fromEntries(url.searchParams),
      body: parsedBody,
      searchParams: Object.fromEntries(url.searchParams),
    });
    const total = performance.now() - reqStart;
    logRequest({ method, url: "/" + segments.join("/"), status: result?.status || 200, duration: total, compileMs: 0 });
    if (result instanceof Response) return result;
    if (result && typeof result === "object") {
      return new Response(JSON.stringify(result), {
        status: result.status || 200,
        headers: { "Content-Type": "application/json", ...(result.headers || {}) },
      });
    }
    return new Response(String(result ?? ""), {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (err) {
    logError(err, `Failed to handle ${method} /${segments.join("/")}`);
    const total = performance.now() - reqStart;
    logRequest({ method, url: "/" + segments.join("/"), status: 500, duration: total, compileMs: 0 });
    return new Response(JSON.stringify({ error: err?.message || "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

const MIME = {
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".gif": "image/gif", ".webp": "image/webp", ".avif": "image/avif",
  ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".css": "text/css", ".js": "application/javascript", ".mjs": "application/javascript",
  ".json": "application/json", ".txt": "text/plain", ".woff": "font/woff",
  ".woff2": "font/woff2", ".ttf": "font/ttf", ".otf": "font/otf",
  ".mp4": "video/mp4", ".webm": "video/webm", ".mp3": "audio/mpeg",
};

await checkAppDir();
try { validateRoutingConventions(); } catch {}
await detectNetworkUrls();
logStartupBanner(`http://localhost:${port}`, networkUrls);
logLine([` ${paint("dim", "› setupWatcher…")}`]);
try {
  setupWatcher();
  logLine([` ${paint("dim", "› watcher ready")}`]);
} catch (err) {
  logLine([` ${paint("red", "watcher error:")} ${err.message}`]);
}

logLine([` ${paint("dim", `› listen on ${hostname}:${port}…`)}`]);
try {
  if (typeof Bun !== "undefined" && typeof Bun.serve === "function") {
    serverHandle = Bun.serve({
      port,
      hostname,
      async fetch(req) {
        return await handleFetch(req);
      },
    });
    logReady();
    await new Promise(() => {});
  } else {
    const http = await import("node:http");
    const srv = http.createServer(async (req, res) => {
      await handleRequest(req, res);
    });
    srv.on("error", (err) => logError(err, "server error"));
    srv.listen(port, hostname, () => {
      logReady();
    });
    serverHandle = srv;
  }
} catch (err) {
  logError(err, "listen error");
}

process.on("SIGINT", () => {
  logLine([`\n ${paint("yellow", "■")} ${paint("dim", "Stopping dev server…")}\n`]);
  if (serverHandle && typeof serverHandle.close === "function") {
    serverHandle.close(() => process.exit(0));
  } else if (serverHandle && typeof serverHandle.stop === "function") {
    serverHandle.stop();
    process.exit(0);
  } else {
    process.exit(0);
  }
  setTimeout(() => process.exit(0), 2000).unref();
});
