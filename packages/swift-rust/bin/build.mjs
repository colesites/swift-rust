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
    return { status: res.status, body: await res.text() };
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

function writeConfigJson(outDir, _hasPublic) {
  // Build Output API v3 config. Only schema-valid fields here — unknown
  // top-level fields or route properties are rejected at "Deploying outputs".
  const config = {
    version: 3,
    routes: [
      { src: "/_swift-rust/static/(.*)", headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
      { src: "/fonts/(.*)", headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
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
  for (const dyn of dynamics) {
    const params = await enumerateParams(dyn);
    if (params.length === 0) {
      process.stdout.write(`  ${paint("dim", "•")} dynamic ${paint("cyan", dyn.base + "/[" + dyn.paramName + "]")}: ${paint("yellow", "needs serverless function (skipped for v0.1.0)")}\n`);
      continue;
    }
    const routes = routesFromParams(dyn.base, dyn.paramName, params);
    for (const r of routes) staticRoutes.push(r);
    process.stdout.write(`  ${paint("dim", "•")} dynamic ${paint("cyan", dyn.base + "/[" + dyn.paramName + "]")}: ${paint("bold", String(routes.length))}\n`);
  }

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
  try {
    await waitForServer();
    process.stdout.write(`  ${paint("green", "✓")} server ready\n\n`);

    for (const route of allRoutes) {
      try {
        const { status, body } = await fetchRoute(route);
        if (status === 200) {
          const cleaned = rewriteImageUrls(await localizeIslands(stripHmrScript(body)));
          writeStaticFile(STATIC_DIR, route, cleaned);
          okCount++;
          process.stdout.write(`  ${paint("green", "✓")} ${route}\n`);
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

    writeConfigJson(OUT_DIR, hasPublic);

    const total = Date.now() - start;
    const outRel = OUT_DIR.startsWith(cwd + sep) ? OUT_DIR.slice(cwd.length + 1) : OUT_DIR;
    const skippedPart = skipCount > 0 ? paint("dim", `${skipCount} skipped`) : "";
    const failedPart = failCount > 0 ? paint("yellow", `${failCount} failed`) : paint("dim", "0 failed");
    const summary = `  ${paint("green", "✓")} ${okCount} ok  ${skippedPart}  ${failedPart}\n`;
    process.stdout.write(`\n  ${paint("bold", "done")} ${paint("dim", "in " + fmtMs(total))}\n`);
    process.stdout.write(summary);
    process.stdout.write(`  ${paint("dim", "output: " + outRel)}\n\n`);

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
