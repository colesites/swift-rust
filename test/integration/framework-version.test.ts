import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { errorOverlayHTML } from "../../packages/swift-rust/bin/error-overlay.mjs";
import { FRAMEWORK_VERSION } from "../../packages/swift-rust/bin/runtime/framework-version.mjs";

const ROOT = join(import.meta.dir, "..", "..");
const packageJson = JSON.parse(
  readFileSync(join(ROOT, "packages", "swift-rust", "package.json"), "utf8"),
);

describe("framework version display", () => {
  test("reads the installed swift-rust package version", () => {
    expect(FRAMEWORK_VERSION).toBe(packageJson.version);
  });

  test("shows the installed version in the error overlay", () => {
    const html = errorOverlayHTML({ message: "Test error" });
    expect(html).toContain(`Swift Rust v${packageJson.version} · dev mode`);
    expect(html).not.toContain("Swift Rust v0.1.0");
  });
});
