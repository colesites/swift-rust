import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, test } from "bun:test";

const ROOT = join(import.meta.dir, "..", "..");
const GEN_PKG = join(ROOT, "packages", "create-swift-rust");
const GEN = join(GEN_PKG, "dist", "index.js");
const FONT_GOOGLE = join(ROOT, "packages", "font", "dist", "google.js");

const tmps: string[] = [];
function scaffold(args: string[]): string {
  const dir = mkdtempSync(join(tmpdir(), "sr-create-"));
  tmps.push(dir);
  const r = spawnSync("node", [GEN, "app", ...args, "--yes"], { cwd: dir, encoding: "utf8" });
  if (r.status !== 0) throw new Error(`scaffold failed (${args.join(" ")}):\n${r.stdout}\n${r.stderr}`);
  return join(dir, "app");
}

beforeAll(() => {
  // Ensure the generator + font dist are built (the test imports both).
  for (const pkg of [GEN_PKG, join(ROOT, "packages", "font")]) {
    const r = spawnSync("bun", ["run", "build"], { cwd: pkg, encoding: "utf8" });
    if (r.status !== 0) throw new Error(`build ${pkg} failed:\n${r.stderr}`);
  }
}, 120_000);

afterAll(() => {
  for (const d of tmps) rmSync(d, { recursive: true, force: true });
});

describe("create-swift-rust: full demo", () => {
  const app = () => scaffold(["--full"]);
  test("scaffolds the demo routes + editor config", () => {
    const a = app();
    expect(existsSync(join(a, "src", "app", "blog"))).toBe(true);
    expect(existsSync(join(a, "src", "app", "dashboard"))).toBe(true);
    expect(existsSync(join(a, ".vscode", "settings.json"))).toBe(true);
    const pkg = JSON.parse(readFileSync(join(a, "package.json"), "utf8"));
    expect(pkg.dependencies?.["swift-rust"]).toBeDefined();
  });
});

describe("create-swift-rust: minimal (TS)", () => {
  test("clean app, no demo routes, no deprecated baseUrl", () => {
    const a = scaffold(["--minimal"]);
    expect(existsSync(join(a, "src", "app", "page.tsx"))).toBe(true);
    expect(existsSync(join(a, "src", "app", "blog"))).toBe(false);
    expect(existsSync(join(a, "biome.json"))).toBe(true);
    const tsconfig = readFileSync(join(a, "tsconfig.json"), "utf8");
    expect(tsconfig).not.toContain("baseUrl");
    expect(tsconfig).not.toContain("ignoreDeprecations");
  });
});

describe("create-swift-rust: minimal (JS + ESLint + no Tailwind + top-level app)", () => {
  test("honors every flag", () => {
    const a = scaffold(["--minimal", "--js", "--eslint", "--no-tailwind", "--no-src-dir"]);
    expect(existsSync(join(a, "jsconfig.json"))).toBe(true);
    expect(existsSync(join(a, "eslint.config.mjs"))).toBe(true);
    expect(existsSync(join(a, "app", "page.jsx"))).toBe(true);
    expect(existsSync(join(a, "src"))).toBe(false);
    expect(existsSync(join(a, "tailwind.config.ts"))).toBe(false);
  });
});

describe("generated layout font imports are real exports", () => {
  // This is the regression guard for the `Geist_Mono` bug: every name the
  // scaffolded layout imports from swift-rust/font/google must actually exist.
  test("every swift-rust/font/google import resolves", async () => {
    const a = scaffold(["--minimal"]);
    const layout = readFileSync(join(a, "src", "app", "layout.tsx"), "utf8");
    const match = layout.match(/import\s*\{([^}]+)\}\s*from\s*["']swift-rust\/font\/google["']/);
    expect(match).not.toBeNull();
    const names = (match?.[1] ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    expect(names.length).toBeGreaterThan(0);
    const mod = (await import(FONT_GOOGLE)) as Record<string, unknown>;
    for (const name of names) {
      expect(typeof mod[name]).toBe("function");
    }
  });
});
