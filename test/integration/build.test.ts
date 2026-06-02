import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const FIXTURE = join(import.meta.dir, "..", "fixtures", "basic");

test("basic fixture exists", () => {
  expect(existsSync(FIXTURE)).toBe(true);
  expect(existsSync(join(FIXTURE, "package.json"))).toBe(true);
  expect(existsSync(join(FIXTURE, "swift-rust.config.json"))).toBe(true);
  expect(existsSync(join(FIXTURE, "tsconfig.json"))).toBe(true);
  expect(existsSync(join(FIXTURE, "app", "page.tsx"))).toBe(true);
});

test("basic fixture references workspace swift-rust package", () => {
  const pkg = JSON.parse(readFileSync(join(FIXTURE, "package.json"), "utf8")) as {
    dependencies?: Record<string, string>;
  };
  expect(pkg.dependencies?.["swift-rust"]).toBe("workspace:*");
});
