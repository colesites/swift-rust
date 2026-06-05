import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, describe, expect, test } from "bun:test";

const ROOT = join(import.meta.dir, "..", "..");
const FIX = join(import.meta.dir, "..", "fixtures", "app");
const BUILD = join(ROOT, "packages", "swift-rust", "bin", "build.mjs");
const OUT = join(FIX, ".vercel", "output");
const STATIC = join(OUT, "static");
const FN = join(OUT, "functions");

const readStatic = (p: string) => readFileSync(join(STATIC, p), "utf8");
const readJson = (p: string) => JSON.parse(readFileSync(p, "utf8"));

beforeAll(() => {
  const r = spawnSync("bun", [BUILD], { cwd: FIX, encoding: "utf8" });
  if (r.status !== 0) throw new Error(`fixture build failed:\n${r.stdout}\n${r.stderr}`);
}, 90_000);

describe("static rendering", () => {
  test("home page is prerendered to static HTML", () => {
    expect(existsSync(join(STATIC, "index.html"))).toBe(true);
    expect(readStatic("index.html")).toContain("data-home");
  });
  test("<Image> routes through the Vercel optimizer with bounded width", () => {
    const html = readStatic("index.html");
    expect(html).toContain("/_vercel/image?url=");
    expect(html).not.toContain("/_swift-rust/image"); // dev-only endpoint must be gone
    expect(html).toMatch(/w=(640|750|828|1080|1200|1920|2048|3840)/);
  });
  test("metadata + OpenGraph are emitted", () => {
    const html = readStatic("index.html");
    expect(html).toContain("<title>Fixture</title>");
    expect(html).toContain('property="og:image"');
    expect(html).toContain('property="og:image:width"');
  });
  test("config.json enables the image optimizer", () => {
    const cfg = readJson(join(OUT, "config.json"));
    expect(cfg.images?.sizes).toContain(3840);
  });
});

describe("fonts", () => {
  test("Google font <link> is injected from the layout", () => {
    expect(readStatic("index.html")).toContain("fonts.googleapis.com/css2");
  });
  test("bundled local fonts are emitted to the output", () => {
    expect(existsSync(join(STATIC, "_swift-rust", "fonts", "Lausanne.otf"))).toBe(true);
  });
});

describe("client runtime", () => {
  test("the navigator script is emitted and injected", () => {
    expect(existsSync(join(STATIC, "_swift-rust", "navigator.js"))).toBe(true);
    expect(readStatic("index.html")).toContain("/_swift-rust/navigator.js");
  });
});

describe("function emission", () => {
  test("a 'use node' route emits a Node function", () => {
    const cfg = readJson(join(FN, "dash.func", ".vc-config.json"));
    expect(cfg.runtime).toBe("nodejs22.x");
    expect(cfg.launcherType).toBe("Nodejs");
    expect(existsSync(join(FN, "dash.func", "index.js"))).toBe(true);
  });
  test("a [param] route emits one function + a config.json route", () => {
    expect(existsSync(join(FN, "item", "[id].func", "index.js"))).toBe(true);
    const cfg = readJson(join(OUT, "config.json"));
    expect(cfg.routes.some((r: { dest?: string }) => r.dest === "/item/[id]")).toBe(true);
    expect(cfg.routes.some((r: { src?: string }) => r.src === "^/item/([^/]+)/?$")).toBe(true);
  });
  test("@slot dirs are not emitted as routes", () => {
    expect(existsSync(join(STATIC, "shop", "@panel"))).toBe(false);
  });
});

async function invoke(funcRel: string, path: string, init?: RequestInit) {
  const mod = await import(join(FN, funcRel, "index.js"));
  const handler = typeof mod.default === "function" ? mod.default : mod.default.fetch;
  const res: Response = await handler(new Request(`https://t.dev${path}`, init));
  return {
    status: res.status,
    location: res.headers.get("location"),
    html: res.status === 200 ? await res.text() : "",
  };
}

describe("function request pipeline", () => {
  test("guard (opt-in) redirects when access is denied", async () => {
    const r = await invoke("dash.func", "/dash");
    expect(r.status).toBe(307);
    expect(r.location).toContain("/login");
  });
  test("loader + state + seo run on a successful request", async () => {
    const r = await invoke("dash.func", "/dash?ok=1");
    expect(r.status).toBe(200);
    expect(r.html).toContain("ada"); // loaderData.user
    expect(r.html).toContain("__SR_STATE__"); // state.ts
    expect(r.html).toContain("<title>Dashboard</title>"); // seo.tsx overrides
  });
  test("[param] route extracts params from the URL", async () => {
    const r = await invoke("item/[id].func", "/item/widget-42");
    expect(r.html).toContain("widget-42");
  });
  test("'use client' route is wrapped for hydration with its island bundle", async () => {
    const r = await invoke("widget.func", "/widget");
    expect(r.html).toContain("__sr_island_root");
    expect(r.html).toMatch(/_swift-rust\/island\/[a-z0-9]+\.js/);
  });
  test("parallel @slot is composed into the layout", async () => {
    const r = await invoke("shop.func", "/shop");
    expect(r.html).toContain("PANEL");
  });
});
