import { describe, expect, it } from "bun:test";
import { existsSync } from "node:fs";
import { join } from "node:path";

const APP = join(import.meta.dir, "..", "..", "app");
const SRC = join(APP, "src");

describe("web structure", () => {
  it("has app directory", () => {
    expect(existsSync(APP)).toBe(true);
  });

  it("has app/src directory", () => {
    expect(existsSync(SRC)).toBe(true);
  });

  it("has root layout in app/src", () => {
    expect(existsSync(join(SRC, "layout.tsx"))).toBe(true);
  });

  it("has home page in app/src", () => {
    expect(existsSync(join(SRC, "page.tsx"))).toBe(true);
  });

  it("does not include a dashboard", () => {
    expect(existsSync(join(SRC, "dashboard"))).toBe(false);
  });

  it("has blog with dynamic [slug] route", () => {
    expect(existsSync(join(SRC, "blog", "page.tsx"))).toBe(true);
    expect(existsSync(join(SRC, "blog", "[slug]", "page.tsx"))).toBe(true);
  });

  it("has API routes", () => {
    expect(existsSync(join(SRC, "api", "health", "route.ts"))).toBe(true);
    expect(existsSync(join(SRC, "api", "posts", "route.ts"))).toBe(true);
    expect(existsSync(join(SRC, "api", "posts", "[id]", "route.ts"))).toBe(true);
  });

  it("has special files (not-found, error, loading)", () => {
    expect(existsSync(join(SRC, "not-found.tsx"))).toBe(true);
    expect(existsSync(join(SRC, "error.tsx"))).toBe(true);
    expect(existsSync(join(SRC, "loading.tsx"))).toBe(true);
  });

  it("has all main sections", () => {
    const required = ["about", "blog", "contact", "fonts", "images", "videos"];
    for (const dir of required) {
      expect(existsSync(join(SRC, dir))).toBe(true);
    }
  });
});
