import { type ChildProcess, spawn } from "node:child_process";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, test } from "bun:test";

const ROOT = join(import.meta.dir, "..", "..");
const FIX = join(import.meta.dir, "..", "fixtures", "app");
const DEV = join(ROOT, "packages", "swift-rust", "bin", "dev-server.mjs");
const PORT = 41987;
const BASE = `http://127.0.0.1:${PORT}`;

let proc: ChildProcess;

async function waitReady(timeoutMs = 20_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(`${BASE}/`, { redirect: "manual" });
      if (r.status < 500) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("dev server did not become ready");
}

beforeAll(async () => {
  proc = spawn("bun", [DEV, "--port", String(PORT), "--hostname", "127.0.0.1"], {
    cwd: FIX,
    stdio: "ignore",
  });
  await waitReady();
}, 30_000);

afterAll(() => {
  proc?.kill("SIGTERM");
});

const get = (path: string) => fetch(`${BASE}${path}`, { redirect: "manual" });

describe("dev server route pipeline", () => {
  test("default route resolves to the bun runtime", async () => {
    const r = await get("/");
    expect(r.status).toBe(200);
    expect(r.headers.get("x-swift-rust-runtime")).toBe("bun");
    expect(r.headers.get("x-swift-rust-dynamic")).toBeNull();
  });

  test("'use node' route reports node runtime + dynamic", async () => {
    const r = await get("/dash?ok=1");
    expect(r.status).toBe(200);
    expect(r.headers.get("x-swift-rust-runtime")).toBe("node");
    expect(r.headers.get("x-swift-rust-dynamic")).toBe("1");
  });

  test("opt-in guard ('use guard') redirects when denied", async () => {
    const r = await get("/dash");
    expect(r.status).toBe(307);
    expect(r.headers.get("location")).toContain("/login");
  });

  test("loader data is rendered into the page", async () => {
    const html = await (await get("/dash?ok=1")).text();
    expect(html).toContain("ada");
  });

  test("[param] route resolves and renders the param", async () => {
    const html = await (await get("/item/abc-123")).text();
    expect(html).toContain("abc-123");
  });

  test("the navigator runtime is served", async () => {
    const r = await get("/_swift-rust/navigator.js");
    expect(r.status).toBe(200);
    expect(await r.text()).toContain("__SR_NAV__");
  });
});
