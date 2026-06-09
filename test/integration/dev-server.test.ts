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

  // Component-level "use client" islands: a 'use client' component imported into
  // a server page must SSR inside a hydration marker (with serialized props) and
  // get a self-mounting browser bundle, so it becomes interactive on the client.
  test("a 'use client' component in a server page becomes a hydrated island", async () => {
    const html = await (await get("/counter")).text();
    // SSR'd inside a marker, with the server-passed props serialized.
    expect(html).toContain("data-sr-island");
    expect(html).toMatch(/data-sr-island-src="[^"]*counter\.tsx"/);
    expect(html).toContain('data-sr-island-export="Counter"');
    expect(html).toContain("&quot;start&quot;:5");
    expect(html).toContain("&quot;label&quot;:&quot;hits&quot;");
    // A per-component island script is injected.
    const m = html.match(/\/_swift-rust\/island-comp\.js\?p=([^"]+)/);
    expect(m).not.toBeNull();
    // The bundle is self-mounting and contains the real component logic.
    const bundle = await (await get(`/_swift-rust/island-comp.js?p=${m![1]}`)).text();
    expect(bundle).toContain("hydrateRoot");
    expect(bundle).toContain("useState");
    expect(bundle).toContain("data-sr-island-src");
  });

  // 'use static' marks a route as a hard-static guarantee: it renders, tags
  // itself static, and gets a long-lived revalidatable CDN cache (no dynamic).
  test("'use static' route renders static with an aggressive cache header", async () => {
    const r = await get("/static-ok");
    expect(r.status).toBe(200);
    expect(r.headers.get("x-swift-rust-render")).toBe("static");
    expect(r.headers.get("x-swift-rust-dynamic")).toBeNull();
    expect(r.headers.get("cache-control")).toContain("s-maxage=31536000");
  });

  // 'use static' + a dynamic signal (here a 'use node' runtime directive) must
  // fail loudly rather than silently shipping a wrong cache contract.
  test("'use static' conflicting with a dynamic runtime fails loudly", async () => {
    const r = await get("/static-bad");
    expect(r.status).toBeGreaterThanOrEqual(500);
    const body = await r.text();
    expect(body).toContain("use static");
    expect(body).toContain("use node");
  });

  // cache() memoizes loader data across requests; the on-demand revalidate
  // endpoint purges by tag so the next request recomputes.
  test("cache() + revalidateTag invalidates loader data on demand", async () => {
    const strip = (s: string) => s.replace(/<!--[^>]*-->/g, "");
    const read = async () => {
      const m = strip(await (await get("/cached")).text()).match(/data-cached[^>]*>n=(\d+)/);
      return m ? Number(m[1]) : NaN;
    };
    const a = await read();
    const b = await read();
    expect(a).toBe(b); // cached → identical

    const res = await fetch(`${BASE}/_swift-rust/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag: "counter" }),
    });
    const json = (await res.json()) as { revalidated: boolean; purged: number };
    expect(json.revalidated).toBe(true);
    expect(json.purged).toBeGreaterThanOrEqual(1);

    const c = await read();
    expect(c).toBeGreaterThan(a); // recomputed after purge
  });

  test("revalidate endpoint rejects non-POST", async () => {
    const r = await get("/_swift-rust/revalidate");
    expect(r.status).toBe(405);
  });

  // The 'use cache' directive auto-memoizes a module's async exports (tagged by
  // file path), so a loader calling them is cached until revalidated.
  test("'use cache' directive memoizes async exports until revalidated", async () => {
    const strip = (s: string) => s.replace(/<!--[^>]*-->/g, "");
    const read = async () => {
      const m = strip(await (await get("/usecache")).text()).match(/data-uc[^>]*>n=(\d+)/);
      return m ? Number(m[1]) : NaN;
    };
    const a = await read();
    expect(await read()).toBe(a); // memoized by the directive
    await fetch(`${BASE}/_swift-rust/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag: "src/app/usecache/data.ts" }),
    });
    expect(await read()).toBeGreaterThan(a); // file-path tag purged it
  });
});
