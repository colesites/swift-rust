import { type ChildProcess, spawn } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
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

  // Regression guard for the stale-until-restart bug: editing a file under
  // src/components/ (imported transitively by a page) must re-render on the
  // next request without restarting the server.
  test("HMR: editing a src/components file re-renders without a restart", async () => {
    const widget = join(FIX, "src", "components", "widget.tsx");
    const original = readFileSync(widget, "utf8");
    try {
      expect(await (await get("/")).text()).toContain("VERSION1");
      writeFileSync(widget, original.replace("VERSION1", "HMR_RELOADED"));
      let after = "";
      for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 150));
        after = await (await get("/")).text();
        if (after.includes("HMR_RELOADED")) break;
      }
      expect(after).toContain("HMR_RELOADED");
    } finally {
      writeFileSync(widget, original);
    }
  });

  // Regression guard for the browser-never-reloads bug: the server emits the
  // HMR signal as an *unnamed* SSE message (`data: {...}` with no `event:` line),
  // which fires the browser's default "message" event. The hmr-client therefore
  // MUST listen on "message" and unwrap the {event,data} envelope — listening
  // only on "change" silently dropped every reload. We assert both halves here.
  test("HMR: SSE emits an unwrappable reload payload + client listens on 'message'", async () => {
    const hmrClient = readFileSync(
      join(ROOT, "packages", "swift-rust", "bin", "runtime", "hmr-client.js"),
      "utf8",
    );
    expect(hmrClient).toContain('addEventListener("message"');

    const widget = join(FIX, "src", "components", "widget.tsx");
    const original = readFileSync(widget, "utf8");
    const res = await fetch(`${BASE}/_swift-rust/hmr`);
    const reader = res.body!.getReader();
    const dec = new TextDecoder();
    let buf = "";
    let reloadSeen = false;
    try {
      writeFileSync(widget, original.replace("VERSION1", "SSE_RELOAD"));
      const deadline = Date.now() + 6000;
      while (Date.now() < deadline && !reloadSeen) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let i: number;
        while ((i = buf.indexOf("\n\n")) !== -1) {
          const frame = buf.slice(0, i);
          buf = buf.slice(i + 2);
          const dataLine = frame.split("\n").find((l) => l.startsWith("data:"));
          if (!dataLine) continue;
          const msg = JSON.parse(dataLine.slice(5).trim());
          const data = msg && msg.event && msg.data ? msg.data : msg;
          if (data.type === "reload") reloadSeen = true;
        }
      }
    } finally {
      await reader.cancel().catch(() => {});
      writeFileSync(widget, original);
    }
    expect(reloadSeen).toBe(true);
  }, 12_000);

  // A 'use server' component imported into a 'use client' page used to silently
  // do nothing (the directive was ignored, the component never ran server-side,
  // no error). It must now fail loudly with actionable guidance, because this
  // SSR + islands model has no React Server Components / Flight to run it.
  test("'use server' component inside a 'use client' page fails loudly", async () => {
    const fs = await import("node:fs");
    const dir = join(FIX, "src", "app", "badclient");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      join(dir, "thing.tsx"),
      "'use server'\nexport function Thing(){ return <span data-thing>t</span>; }\n",
    );
    fs.writeFileSync(
      join(dir, "page.tsx"),
      "'use client'\nimport { Thing } from \"./thing\";\nexport default function Page(){ return <Thing/>; }\n",
    );
    try {
      let res!: Response;
      for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 150));
        res = await get("/badclient");
        if (res.status >= 500) break;
      }
      expect(res.status).toBeGreaterThanOrEqual(500);
      const body = await res.text();
      expect(body).toContain("use server");
      expect(body).toContain("use client");
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }, 12_000);
});
