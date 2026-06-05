#!/usr/bin/env node
import { spawn } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
  cpSync,
  openSync,
  unlinkSync,
} from "node:fs";
import { join, resolve, dirname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const cwd = process.cwd();
const APP_DIR_CANDIDATES = [resolve(cwd, "src", "app"), resolve(cwd, "app")];
const APP_DIR = APP_DIR_CANDIDATES.find((p) => existsSync(p)) ?? resolve(cwd, "app");
const PUBLIC_DIR = resolve(cwd, "public");
const OUT_DIR = resolve(cwd, ".vercel", "output");
const STATIC_DIR = join(OUT_DIR, "static");
const RUNTIME_DIR = resolve(fileURLToPath(import.meta.url), "..", "runtime");

const ROUTING_EXTS = [".tsx", ".ts", ".jsx", ".js"];

// Scan a file's leading directives for a runtime / guard opt-in.
function scanFileDirectives(file) {
  const out = { runtime: null, guard: false };
  try {
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("//") || t.startsWith("/*") || t.startsWith("*")) continue;
      const m = t.match(/^["']use (bun|edge|node|worker|guard)["'];?$/);
      if (m) {
        if (m[1] === "guard") out.guard = true;
        else if (!out.runtime) out.runtime = m[1];
        continue;
      }
      if (/^["']use [a-z]+["'];?$/.test(t)) continue;
      break;
    }
  } catch {}
  return out;
}

// Source-level detection of a route's runtime/guard opt-in (page + layouts),
// so dynamic routes are emitted even when a build-time GET redirects.
function scanDirectives(pageFile) {
  const { layouts } = collectChainFiles(pageFile);
  let runtime = null;
  let guard = false;
  for (const f of [pageFile, ...layouts]) {
    const d = scanFileDirectives(f);
    if (d.runtime && !runtime) runtime = d.runtime;
    if (d.guard) guard = true;
  }
  return { runtime, guardEnabled: guard };
}

function findRoutingFile(dir, base) {
  for (const ext of ROUTING_EXTS) {
    const f = join(dir, `${base}${ext}`);
    if (existsSync(f)) return f;
  }
  return null;
}

// Collect the routing files along a page's dir chain (outer → inner) plus the
// URL pattern segments (with [param] markers preserved). Mirrors the dev
// server's pipeline so the emitted function has the same behavior.
function collectChainFiles(pageFile) {
  const layouts = []; // { file, slots: [{ name, file }] }
  const proxies = [];
  const schemas = [];
  const guards = [];
  const loaders = [];
  let actionFile = null;
  let queryFile = null;
  let stateFile = null;
  let seoFile = null;
  let i18nFile = null;
  let revalidateFile = null;
  const pattern = [];
  const rel = dirname(pageFile).slice(APP_DIR.length).replace(/^[/\\]/, "");
  const segs = rel ? rel.split(sep) : [];
  if (APP_DIR.endsWith(`${sep}app`) && dirname(APP_DIR).endsWith(`${sep}src`)) {
    const rp = findRoutingFile(dirname(APP_DIR), "proxy");
    if (rp) proxies.push(rp);
  }
  const slotsFor = (d) => {
    const out = [];
    try {
      for (const e of readdirSync(d, { withFileTypes: true })) {
        if (e.isDirectory() && e.name.startsWith("@")) {
          const sd = join(d, e.name);
          const file = findRoutingFile(sd, "page") || findRoutingFile(sd, "fragment") || findRoutingFile(sd, "default");
          if (file) out.push({ name: e.name.slice(1), file });
        }
      }
    } catch {}
    return out;
  };
  let dir = APP_DIR;
  const scan = (d, isLeaf) => {
    const l = findRoutingFile(d, "layout");
    if (l) layouts.push({ file: l, slots: slotsFor(d) });
    const p = findRoutingFile(d, "proxy");
    if (p) proxies.push(p);
    const s = findRoutingFile(d, "schema");
    if (s) schemas.push(s);
    const g = findRoutingFile(d, "guard");
    if (g) guards.push(g);
    const ld = findRoutingFile(d, "loader");
    if (ld) loaders.push(ld);
    const q = findRoutingFile(d, "query");
    if (q) queryFile = q;
    const st = findRoutingFile(d, "state");
    if (st) stateFile = st;
    const se = findRoutingFile(d, "seo");
    if (se) seoFile = se;
    const i = findRoutingFile(d, "i18n");
    if (i) i18nFile = i;
    const rv = findRoutingFile(d, "revalidate");
    if (rv) revalidateFile = rv;
    if (isLeaf) {
      const a = findRoutingFile(d, "action");
      if (a) actionFile = a;
    }
  };
  scan(dir, segs.length === 0);
  for (let i = 0; i < segs.length; i++) {
    dir = join(dir, segs[i]);
    pattern.push(segs[i]);
    scan(dir, i === segs.length - 1);
  }
  return { layouts, proxies, schemas, guards, loaders, actionFile, queryFile, stateFile, seoFile, i18nFile, revalidateFile, pattern };
}

function isClientPageFile(file) {
  return scanFileDirectivesRaw(file).includes("client");
}
function scanFileDirectivesRaw(file) {
  const found = [];
  try {
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("//") || t.startsWith("/*") || t.startsWith("*")) continue;
      const m = t.match(/^["']use ([a-z]+)["'];?$/);
      if (m) {
        found.push(m[1]);
        continue;
      }
      break;
    }
  } catch {}
  return found;
}

// Build a client-island bundle for a "use client" page (served by the dev
// server during build) and write it to the static output. Returns its URL.
async function buildIslandAsset(pageFile) {
  try {
    const res = await fetch(`http://${HOST}:${PORT}/_swift-rust/island.js?p=${encodeURIComponent(pageFile)}`);
    if (!res.ok) return null;
    const code = await res.text();
    const rel = `_swift-rust/island/${simpleHash(pageFile)}.js`;
    writeRawFile(STATIC_DIR, rel, code);
    return `/${rel}`;
  } catch {
    return null;
  }
}

// Generate + bundle a Vercel function (.func) for one dynamic route.
async function emitFunction({ route, funcRel, pageFile, runtime, head, guardEnabled, isClient, islandSrc }) {
  if (typeof Bun === "undefined" || typeof Bun.build !== "function") return false;
  const f = collectChainFiles(pageFile);
  const fnCore = join(RUNTIME_DIR, "fn-core.mjs");
  const imports = [`import { makeRouteHandler } from ${JSON.stringify(fnCore)};`];
  let uid = 0;
  const ns = (file) => {
    const name = `__m${uid++}`;
    imports.push(`import * as ${name} from ${JSON.stringify(file)};`);
    return name;
  };
  const arr = (files) => `[${files.map((file) => ns(file)).join(", ")}]`;
  const opt = (file) => (file ? ns(file) : "undefined");

  // IMPORTANT: resolve every ns()/arr()/opt() (which append to `imports`)
  // BEFORE joining `imports` — otherwise body-only modules go unimported.
  const pageNs = ns(pageFile);
  const layoutsArr = `[${f.layouts.map((l) => ns(l.file)).join(", ")}]`;
  const slotsArr = `[${f.layouts.map((l) => `[${l.slots.map((s) => `{ name: ${JSON.stringify(s.name)}, mod: ${ns(s.file)} }`).join(", ")}]`).join(", ")}]`;
  const proxiesArr = arr(f.proxies);
  const schemasArr = arr(f.schemas);
  const guardsArr = arr(f.guards);
  const loadersArr = arr(f.loaders);
  const actionNs = opt(f.actionFile);
  const queryNs = opt(f.queryFile);
  const stateNs = opt(f.stateFile);
  const seoNs = opt(f.seoFile);
  const i18nNs = opt(f.i18nFile);
  const revNs = opt(f.revalidateFile);

  const entry =
    `${imports.join("\n")}\n` +
    `const handler = makeRouteHandler({\n` +
    `  page: ${pageNs}, layouts: ${layoutsArr}, layoutMetas: ${layoutsArr}, slots: ${slotsArr},\n` +
    `  proxies: ${proxiesArr}, schemas: ${schemasArr}, guards: ${guardsArr}, guardEnabled: ${guardEnabled ? "true" : "false"},\n` +
    `  action: ${actionNs}, loaders: ${loadersArr}, query: ${queryNs}, state: ${stateNs},\n` +
    `  seo: ${seoNs}, i18n: ${i18nNs}, revalidate: ${revNs},\n` +
    `  isClient: ${isClient ? "true" : "false"}, islandSrc: ${JSON.stringify(islandSrc || "")},\n` +
    `  pattern: ${JSON.stringify(f.pattern)}, runtime: ${JSON.stringify(runtime)}, head: ${JSON.stringify(head)},\n` +
    `});\n` +
    (runtime === "bun" ? `export default { fetch: handler };\n` : `export default handler;\n`);

  const rel = funcRel || (route === "/" ? "index.func" : `${route.replace(/^\//, "")}.func`);
  const funcDir = join(OUT_DIR, "functions", rel);
  mkdirSync(funcDir, { recursive: true });
  const entryTmp = join(dirname(pageFile), `.__sr_fn_${process.pid}_${simpleHash(rel)}.js`);
  writeFileSync(entryTmp, entry);
  try {
    const isEdge = runtime === "edge";
    const result = await Bun.build({
      entrypoints: [entryTmp],
      target: isEdge ? "browser" : "node",
      format: "esm",
      minify: true,
      external: isEdge ? ["react-dom/server"] : [],
    });
    if (!result.success) throw new AggregateError(result.logs, "function bundle failed");
    const code = await result.outputs[0].text();
    writeFileSync(join(funcDir, "index.js"), code);
    const vcConfig = isEdge
      ? { runtime: "edge", entrypoint: "index.js" }
      : { runtime: "nodejs22.x", handler: "index.js", launcherType: "Nodejs", supportsResponseStreaming: true };
    writeFileSync(join(funcDir, ".vc-config.json"), `${JSON.stringify(vcConfig, null, 2)}\n`);
    return true;
  } finally {
    try {
      unlinkSync(entryTmp);
    } catch {}
  }
}

// Vercel runs functions on Bun when vercel.json sets bunVersion. Ensure it's
// present (preserving the rest of the file) so 'use bun' routes run on Bun.
function ensureBunVersion() {
  const file = resolve(cwd, "vercel.json");
  let json = {};
  if (existsSync(file)) {
    try {
      json = JSON.parse(readFileSync(file, "utf8"));
    } catch {
      json = {};
    }
  }
  if (json.bunVersion) return;
  json.bunVersion = "1.x";
  writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`);
  process.stdout.write(`  ${paint("cyan", "•")} set ${paint("bold", 'vercel.json "bunVersion": "1.x"')} for Bun functions\n`);
}

// Locate the bundled local fonts (installed @swift-rust/font, else monorepo).
function resolveLocalFontDir() {
  const candidates = [];
  try {
    const req = createRequire(import.meta.url);
    const pkg = req.resolve("@swift-rust/font/package.json");
    candidates.push(join(dirname(pkg), "src", "local"), join(dirname(pkg), "dist", "local"));
  } catch {}
  candidates.push(
    resolve(fileURLToPath(import.meta.url), "..", "..", "..", "..", "packages", "font", "src", "local"),
  );
  return candidates.find((d) => existsSync(d)) ?? null;
}

const PORT_START = parseInt(process.env.SWIFT_RUST_BUILD_PORT || "47321", 10);
const HOST = "127.0.0.1";
let PORT = PORT_START;
const ROUTE_TIMEOUT_MS = 30_000;
const HEALTH_TIMEOUT_MS = 30_000;

const CATCH_PARAM = /^\[\.{3}([^\]]+)\]$/;
const NAMED_PARAM = /^\[([^\]]+)\]$/;
const PAGE_EXTENSIONS = ["page.tsx", "page.ts", "page.jsx", "page.js"];
const NOT_FOUND_FILES = ["not-found.tsx", "not-found.ts", "not-found.jsx", "not-found.js"];

const c = {
  reset: "\x1b[0m", bold: "\x1b[1m", dim: "\x1b[2m",
  red: "\x1b[31m", green: "\x1b[32m", yellow: "\x1b[33m",
  cyan: "\x1b[36m", gray: "\x1b[90m",
};
const useColor = process.stdout.isTTY !== false && !process.env.NO_COLOR;
const paint = (color, s) => (useColor ? `${c[color]}${s}${c.reset}` : s);
const fmtMs = (ms) => (ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(2)}s`);

let activeLogFile = null;

function findPageFile(dir) {
  for (const ext of PAGE_EXTENSIONS) {
    const p = join(dir, ext);
    if (existsSync(p)) return p;
  }
  return null;
}

function discoverPages(dir, base = "") {
  const pages = [];
  if (!existsSync(dir)) return pages;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      const catchAll = entry.name.match(CATCH_PARAM);
      if (catchAll) {
        const pageFile = findPageFile(full);
        if (pageFile) {
          pages.push({ type: "catchall", dir: full, file: pageFile, base, paramName: catchAll[1] });
        }
        continue;
      }
      const named = entry.name.match(NAMED_PARAM);
      if (named) {
        const pageFile = findPageFile(full);
        if (pageFile) {
          pages.push({ type: "dynamic", dir: full, file: pageFile, base, paramName: named[1] });
        }
        continue;
      }
      pages.push(...discoverPages(full, base + "/" + entry.name));
    } else if (PAGE_EXTENSIONS.includes(entry.name)) {
      pages.push({ type: "static", file: full, route: base || "/" });
    }
  }
  return pages;
}

function findNotFoundFile(dir) {
  for (const name of NOT_FOUND_FILES) {
    const p = join(dir, name);
    if (existsSync(p)) return p;
  }
  return null;
}

async function enumerateParams(page) {
  for (const ext of PAGE_EXTENSIONS) {
    const p = join(page.dir, ext);
    if (!existsSync(p)) continue;
    try {
      const mod = await import(`${p}?t=${Date.now()}`);
      if (typeof mod.generateStaticParams === "function") {
        return await mod.generateStaticParams();
      }
    } catch {}
  }
  return [];
}

function routesFromParams(base, paramName, params) {
  return params
    .map((p) => {
      const v = p[paramName];
      if (v == null) return null;
      return base + "/" + (Array.isArray(v) ? v.join("/") : String(v));
    })
    .filter(Boolean);
}

function findBun() {
  if (process.env.SWIFT_RUST_RUNTIME) return process.env.SWIFT_RUST_RUNTIME;
  if (process.versions?.bun) return process.execPath;
  const candidates = [
    process.env.BUN_INSTALL ? join(process.env.BUN_INSTALL, "bin", "bun") : null,
    join(process.env.HOME || "", ".bun", "bin", "bun"),
    "/usr/local/bin/bun",
    "/opt/homebrew/bin/bun",
  ].filter(Boolean);
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return process.execPath;
}

async function findFreePort(start) {
  const net = await import("node:net");
  for (let p = start; p < start + 50; p++) {
    const ok = await new Promise((resolve) => {
      const sock = net.createServer();
      sock.once("error", () => resolve(false));
      sock.once("listening", () => sock.close(() => resolve(true)));
      sock.listen(p, HOST);
    });
    if (ok) return p;
  }
  throw new Error(`no free port in range ${start}..${start + 50}`);
}

function startDevServer(port, logFile) {
  const devServer = resolve(fileURLToPath(import.meta.url), "..", "dev-server.mjs");
  const runtime = findBun();
  const stdio = logFile
    ? ["ignore", openSync(logFile, "w"), "inherit"]
    : ["ignore", "inherit", "inherit"];
  const proc = spawn(runtime, [devServer, "--port", String(port), "--hostname", HOST], {
    stdio,
    env: { ...process.env, NO_COLOR: "1", SWIFT_RUST_BUILD: "1" },
    cwd,
  });
  proc.on("error", (e) => process.stderr.write(`  ${paint("red", "dev server spawn error:")} ${e.message}\n`));
  return proc;
}

async function waitForServer(timeoutMs = HEALTH_TIMEOUT_MS) {
  const start = Date.now();
  const url = `http://${HOST}:${PORT}/_swift-rust/health`;
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`dev server did not become ready at ${url} within ${timeoutMs}ms`);
}

async function fetchRoute(pathname, timeoutMs = ROUTE_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`http://${HOST}:${PORT}${pathname}`, {
      signal: controller.signal,
      redirect: "manual",
    });
    return {
      status: res.status,
      body: await res.text(),
      runtime: res.headers.get("x-swift-rust-runtime") || "bun",
      dynamic: res.headers.get("x-swift-rust-dynamic") === "1",
      guardEnabled: res.headers.get("x-swift-rust-guard") === "1",
    };
  } finally {
    clearTimeout(timer);
  }
}

function tailDevLog(lines = 40) {
  if (!activeLogFile || !existsSync(activeLogFile)) return [];
  try {
    const all = readFileSync(activeLogFile, "utf8").split("\n");
    return all.slice(-lines);
  } catch {
    return [];
  }
}

function stripHmrScript(html) {
  return html.replace(/\s*<script src="\/_swift-rust\/hmr-client\.js"[^>]*>\s*<\/script>/g, "");
}

// The dev-time image endpoint (/_swift-rust/image) only exists while the dev
// server runs. On Vercel the platform serves an optimizing endpoint at
// /_vercel/image with the exact same query contract (url, w, q), so we swap the
// path prefix at build time. The `images` config written into config.json
// enables (and bounds) that optimizer. Handles `src`, `srcset`, and `&amp;`.
function rewriteImageUrls(html) {
  return html.split("/_swift-rust/image?").join("/_vercel/image?");
}

function writeStaticFile(outDir, pathname, html) {
  const rel = pathname === "/" ? "index.html" : `${pathname.replace(/^\//, "")}/index.html`;
  const outPath = join(outDir, rel);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
}

// Writes a literal file (e.g. 404.html) at static/<name>, NOT static/<name>/index.html.
function writeRawFile(outDir, name, contents) {
  const outPath = join(outDir, name);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, contents);
}

// Client-island hydration: a "use client" page's HTML references the dev-only
// bundle at /_swift-rust/island.js?p=<file>. For the static export we fetch
// that bundle, write it as a real file, and rewrite the script src to point at
// it — so hydration works on the deployed site, not just in `bun dev`.
const islandWritten = new Map();
function simpleHash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}
async function localizeIslands(html) {
  const re = /\/_swift-rust\/island\.js\?p=([^"]+)/g;
  const found = new Set();
  let m;
  while ((m = re.exec(html)) !== null) found.add(m[1]);
  if (found.size === 0) return html;
  let out = html;
  for (const enc of found) {
    let staticUrl = islandWritten.get(enc);
    if (!staticUrl) {
      const { status, body } = await fetchRoute(`/_swift-rust/island.js?p=${enc}`);
      if (status !== 200) continue;
      const rel = `_swift-rust/island/${simpleHash(enc)}.js`;
      writeRawFile(STATIC_DIR, rel, body);
      staticUrl = `/${rel}`;
      islandWritten.set(enc, staticUrl);
    }
    out = out.split(`/_swift-rust/island.js?p=${enc}`).join(staticUrl);
  }
  return out;
}

function writeConfigJson(outDir, _hasPublic, fnRoutes = []) {
  // Build Output API v3 config. Only schema-valid fields here — unknown
  // top-level fields or route properties are rejected at "Deploying outputs".
  const config = {
    version: 3,
    routes: [
      { src: "/_swift-rust/static/(.*)", headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
      { src: "/fonts/(.*)", headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
      // [param] / catch-all routes → their request-time function.
      ...fnRoutes,
      { handle: "filesystem" },
      { src: "^(.*)$", status: 404, dest: "/404.html" },
    ],
    overrides: {
      "404.html": { path: "404", contentType: "text/html; charset=utf-8" },
    },
    // Enables Vercel's image optimizer (/_vercel/image). `sizes` MUST match the
    // widths <Image> requests (packages/image DEVICE_SIZES) or requests 400.
    images: {
      sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      formats: ["image/avif", "image/webp"],
      minimumCacheTTL: 86400,
      // Allow optimizing local SVG assets (e.g. blog covers); sandboxed by CSP.
      dangerouslyAllowSVG: true,
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
  };
  writeFileSync(join(outDir, "config.json"), `${JSON.stringify(config, null, 2)}\n`);
}

async function main() {
  const start = Date.now();
  process.stdout.write(`\n  ${paint("cyan", "▲")} ${paint("bold", "swift-rust build")} ${paint("dim", "→ .vercel/output (BOA v3)")}\n`);

  if (!existsSync(APP_DIR)) {
    process.stderr.write(`\n  ${paint("red", "✗")} No app/ directory found in ${cwd}\n\n`);
    process.exit(1);
  }

  process.stdout.write(`  ${paint("dim", "app:   ")} ${paint("cyan", APP_DIR.replace(cwd + sep, ""))}\n`);
  process.stdout.write(`  ${paint("dim", "out:   ")} ${paint("cyan", ".vercel/output")}\n\n`);

  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(STATIC_DIR, { recursive: true });

  const pages = discoverPages(APP_DIR);
  const staticRoutes = pages.filter((p) => p.type === "static").map((p) => p.route);
  const catchalls = pages.filter((p) => p.type === "catchall");
  const dynamics = pages.filter((p) => p.type === "dynamic");
  process.stdout.write(`  ${paint("dim", "•")} static routes: ${paint("bold", String(staticRoutes.length))}\n`);

  for (const ca of catchalls) {
    const params = await enumerateParams(ca);
    const routes = routesFromParams(ca.base, ca.paramName, params);
    for (const r of routes) staticRoutes.push(r);
    process.stdout.write(`  ${paint("dim", "•")} catch-all ${paint("cyan", ca.base + "/[...]")}: ${paint("bold", String(routes.length))}\n`);
  }
  const paramFns = []; // dynamic pages with no static params → request-time functions
  for (const dyn of dynamics) {
    const params = await enumerateParams(dyn);
    if (params.length === 0) {
      paramFns.push(dyn);
      process.stdout.write(`  ${paint("dim", "•")} dynamic ${paint("cyan", dyn.base + "/[" + dyn.paramName + "]")}: ${paint("cyan", "→ function")}\n`);
      continue;
    }
    const routes = routesFromParams(dyn.base, dyn.paramName, params);
    for (const r of routes) staticRoutes.push(r);
    process.stdout.write(`  ${paint("dim", "•")} dynamic ${paint("cyan", dyn.base + "/[" + dyn.paramName + "]")}: ${paint("bold", String(routes.length))}\n`);
  }

  // route → page file (for static-type routes that may opt into a runtime fn).
  const routeToFile = new Map();
  for (const p of pages) if (p.type === "static") routeToFile.set(p.route, p.file);

  const allRoutes = [...new Set(staticRoutes)].sort();
  process.stdout.write(`  ${paint("dim", "•")} total: ${paint("bold", String(allRoutes.length))}\n\n`);

  process.stdout.write(`  ${paint("dim", "starting dev server on " + HOST + ":" + PORT_START + "…")}\n`);
  PORT = await findFreePort(PORT_START);
  process.stdout.write(`  ${paint("dim", "using port " + PORT + "\n")}\n`);
  activeLogFile = process.env.SWIFT_RUST_BUILD_LOG || "/tmp/swift-rust-build-dev.log";
  try { unlinkSync(activeLogFile); } catch {}
  const proc = startDevServer(PORT, activeLogFile);
  let okCount = 0;
  let skipCount = 0;
  let failCount = 0;
  let fnCount = 0;
  let usesBunFns = false;
  let fallbackHead = null;
  const fnConfigRoutes = [];
  try {
    await waitForServer();
    process.stdout.write(`  ${paint("green", "✓")} server ready\n\n`);

    for (const route of allRoutes) {
      try {
        const { status, body, runtime, dynamic, guardEnabled } = await fetchRoute(route);
        const pageFile = routeToFile.get(route);
        const cleaned = status === 200 ? rewriteImageUrls(await localizeIslands(stripHmrScript(body))) : null;
        if (cleaned && fallbackHead == null) {
          fallbackHead = (cleaned.match(/<head>([\s\S]*?)<\/head>/i) || [, ""])[1];
        }

        // Decide if this route is a request-time function. Prefer the live
        // headers (200 render); else fall back to a source directive scan so
        // guarded routes that redirect a build-time GET still get a function.
        let fnRuntime = null;
        let fnGuard = false;
        let fnHead = null;
        if (dynamic && pageFile) {
          fnRuntime = runtime;
          fnGuard = guardEnabled;
          fnHead = (cleaned?.match(/<head>([\s\S]*?)<\/head>/i) || [, ""])[1];
        } else if (pageFile && status !== 404) {
          const d = scanDirectives(pageFile);
          if (d.runtime) {
            fnRuntime = d.runtime;
            fnGuard = d.guardEnabled;
            fnHead = fallbackHead || "";
          }
        }

        if (fnRuntime && pageFile) {
          let emitted = false;
          const isClient = isClientPageFile(pageFile);
          const islandSrc = isClient ? await buildIslandAsset(pageFile) : null;
          try {
            emitted = await emitFunction({ route, pageFile, runtime: fnRuntime, head: fnHead, guardEnabled: fnGuard, isClient, islandSrc });
          } catch (e) {
            process.stdout.write(`      ${paint("dim", `fn emit failed: ${e?.message || e}`)}\n`);
          }
          if (emitted) {
            fnCount++;
            if (fnRuntime === "bun") usesBunFns = true;
            process.stdout.write(`  ${paint("cyan", "ƒ")} ${route} ${paint("yellow", `[${fnRuntime}]`)}\n`);
            continue;
          }
        }

        if (status === 200) {
          writeStaticFile(STATIC_DIR, route, cleaned);
          okCount++;
          const rt = runtime && runtime !== "bun" ? ` ${paint("yellow", `[${runtime}]`)}` : "";
          process.stdout.write(`  ${paint("green", "✓")} ${route}${rt}\n`);
        } else if (status === 404) {
          skipCount++;
          process.stdout.write(`  ${paint("dim", "○")} ${route} ${paint("dim", "(404, skipped)")}\n`);
        } else {
          failCount++;
          const snippet = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);
          process.stdout.write(`  ${paint("yellow", "!")} ${route} ${paint("dim", `(${status})`)}\n`);
          if (snippet) process.stdout.write(`      ${paint("dim", snippet)}\n`);
        }
      } catch (e) {
        failCount++;
        process.stdout.write(`  ${paint("red", "✗")} ${route} ${paint("dim", e.name === "AbortError" ? "timeout" : e.message)}\n`);
      }
    }

    // [param] / catch-all routes with no static params → one request-time
    // function each, matched via a config.json route.
    for (const dyn of paramFns) {
      const pageFile = dyn.file;
      const relDir = dirname(pageFile).slice(APP_DIR.length).replace(/^[/\\]/, "").split(sep).join("/");
      const funcRel = `${relDir}.func`;
      const { runtime: dirRt, guardEnabled: dirGuard } = scanDirectives(pageFile);
      const runtime = dirRt || "bun";
      const isClient = isClientPageFile(pageFile);
      const islandSrc = isClient ? await buildIslandAsset(pageFile) : null;
      let emitted = false;
      try {
        emitted = await emitFunction({ funcRel, pageFile, runtime, head: fallbackHead || "", guardEnabled: dirGuard, isClient, islandSrc });
      } catch (e) {
        process.stdout.write(`      ${paint("dim", `fn emit failed: ${e?.message || e}`)}\n`);
      }
      if (emitted) {
        fnCount++;
        if (runtime === "bun") usesBunFns = true;
        // src regex from the pattern segments; dest is the literal function path.
        const src = `^/${relDir.split("/").map((s) => (s.startsWith("[...") ? "(.*)" : s.startsWith("[") ? "([^/]+)" : s)).join("/")}/?$`;
        fnConfigRoutes.push({ src, dest: `/${relDir}` });
        process.stdout.write(`  ${paint("cyan", "ƒ")} /${relDir} ${paint("yellow", `[${runtime}]`)}\n`);
      }
    }

    if (failCount > 0) {
      const tail = tailDevLog(30);
      if (tail.length) {
        process.stdout.write(`\n  ${paint("dim", "dev server tail:")}\n`);
        for (const line of tail) process.stdout.write(`    ${paint("dim", line)}\n`);
      }
    }

    const notFoundFile = findNotFoundFile(APP_DIR);
    if (notFoundFile) {
      try {
        const { status, body } = await fetchRoute("/_not_found_");
        if (status === 200 || status === 404) {
          const html = stripHmrScript(body).replace(/<title>[^<]*<\/title>/, "<title>404 · Swift Rust</title>");
          writeRawFile(STATIC_DIR, "404.html", html);
          process.stdout.write(`\n  ${paint("green", "✓")} 404.html\n`);
        }
      } catch (e) {
        process.stdout.write(`\n  ${paint("yellow", "!")} 404.html ${paint("dim", "fallback to minimal page")}\n`);
      }
    }
    if (!existsSync(join(STATIC_DIR, "404.html"))) {
      writeRawFile(STATIC_DIR, "404.html", `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" /><title>404 · Swift Rust</title></head>
<body><main style="font-family:system-ui;padding:4rem;text-align:center">
<h1>404</h1><p>This page could not be found.</p><a href="/">← Back home</a>
</main></body></html>`);
    }

    if (existsSync(RUNTIME_DIR)) {
      cpSync(RUNTIME_DIR, join(STATIC_DIR, "_swift-rust"), { recursive: true });
    }
    const hasPublic = existsSync(PUBLIC_DIR);
    if (hasPublic) {
      cpSync(PUBLIC_DIR, STATIC_DIR, { recursive: true });
      process.stdout.write(`  ${paint("green", "✓")} copied public/\n`);
    }

    // App-directory metadata icons (app/favicon.ico, app/icon.svg, …) → static root.
    // The <link> tags are already baked into the rendered HTML by the dev server.
    const APP_ICON_FILES = ["favicon.ico", "favicon.svg", "icon.svg", "icon.png", "apple-icon.png"];
    for (const name of APP_ICON_FILES) {
      const src = join(APP_DIR, name);
      if (existsSync(src)) {
        cpSync(src, join(STATIC_DIR, name));
        process.stdout.write(`  ${paint("green", "✓")} ${name}\n`);
      }
    }

    // Client navigator runtime (SPA navigation). The rendered HTML references
    // /_swift-rust/navigator.js; emit it as a static asset so deployed sites
    // get client-side navigation too.
    const navSrc = join(RUNTIME_DIR, "navigator.js");
    if (existsSync(navSrc)) {
      writeRawFile(STATIC_DIR, "_swift-rust/navigator.js", readFileSync(navSrc));
      process.stdout.write(`  ${paint("green", "✓")} _swift-rust/navigator.js\n`);
    }

    // Bundled local fonts — the dev server serves these from
    // /_swift-rust/fonts/; emit them so deployed @font-face URLs resolve.
    const fontDir = resolveLocalFontDir();
    if (fontDir) {
      cpSync(fontDir, join(STATIC_DIR, "_swift-rust", "fonts"), { recursive: true });
      process.stdout.write(`  ${paint("green", "✓")} _swift-rust/fonts/\n`);
    }

    writeConfigJson(OUT_DIR, hasPublic, fnConfigRoutes);

    const total = Date.now() - start;
    const outRel = OUT_DIR.startsWith(cwd + sep) ? OUT_DIR.slice(cwd.length + 1) : OUT_DIR;
    const skippedPart = skipCount > 0 ? paint("dim", `${skipCount} skipped`) : "";
    const failedPart = failCount > 0 ? paint("yellow", `${failCount} failed`) : paint("dim", "0 failed");
    const fnPart = fnCount > 0 ? `  ${paint("cyan", `${fnCount} function${fnCount === 1 ? "" : "s"}`)}` : "";
    const summary = `  ${paint("green", "✓")} ${okCount} ok  ${skippedPart}  ${failedPart}${fnPart}\n`;
    process.stdout.write(`\n  ${paint("bold", "done")} ${paint("dim", "in " + fmtMs(total))}\n`);
    process.stdout.write(summary);
    process.stdout.write(`  ${paint("dim", "output: " + outRel)}\n`);
    if (usesBunFns) {
      ensureBunVersion();
    }
    process.stdout.write("\n");

    const treatFailuresAsWarning = okCount > 0;
    process.exit(treatFailuresAsWarning || failCount === 0 ? 0 : 1);
  } finally {
    try { proc.kill("SIGTERM"); } catch {}
    setTimeout(() => { try { proc.kill("SIGKILL"); } catch {} process.exit(0); }, 2000).unref();
  }
}

main().catch((e) => {
  process.stderr.write(`\n  ${paint("red", "✗")} ${e?.stack || e?.message || String(e)}\n\n`);
  process.exit(1);
});
