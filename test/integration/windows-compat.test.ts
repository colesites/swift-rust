import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import {
  isSupportedBunVersion,
  MINIMUM_BUN_VERSION,
} from "../../packages/swift-rust/bin/runtime/bun-version.mjs";
import { packageAssetName, TARGETS } from "../../packages/swift-rust/scripts/package-native";
import {
  assetName,
  binaryName,
  extractTarBinary,
  getPlatform,
} from "../../packages/swift-rust/scripts/postinstall.js";

const ROOT = join(import.meta.dir, "..", "..");

function tarGzip(name: string, contents: Buffer) {
  const header = Buffer.alloc(512);
  header.write(name);
  header.write("0000777\0", 100);
  header.write("0000000\0", 108);
  header.write("0000000\0", 116);
  header.write(`${contents.length.toString(8).padStart(11, "0")}\0`, 124);
  header.write("00000000000\0", 136);
  header.fill(" ", 148, 156);
  header.write("0", 156);
  header.write("ustar\0", 257);
  const padding = Buffer.alloc(Math.ceil(contents.length / 512) * 512 - contents.length);
  return gzipSync(Buffer.concat([header, contents, padding, Buffer.alloc(1024)]));
}

describe("Windows framework compatibility", () => {
  test("requires the Bun version used by the workspace", () => {
    expect(MINIMUM_BUN_VERSION).toBe("1.3.0");
    expect(isSupportedBunVersion("1.2.99")).toBe(false);
    expect(isSupportedBunVersion("1.3.0")).toBe(true);
    expect(isSupportedBunVersion("2.0.0-canary.1")).toBe(true);
  });

  test("packager and installer agree on the Windows asset", () => {
    const target = TARGETS.find((candidate) => candidate.platform === "win32-x64");
    expect(target).toBeDefined();
    expect(getPlatform("win32", "x64")).toBe("win32-x64");
    expect(binaryName("win32-x64")).toBe("swift-rust.exe");
    expect(assetName("win32-x64")).toBe("swift-rust-x86_64-pc-windows-msvc.exe");
    if (!target) throw new Error("Windows target is missing");
    expect(packageAssetName(target)).toBe(assetName("win32-x64"));
  });

  test("extracts packaged Unix binaries without POSIX shell commands", () => {
    const executable = Buffer.from("swift-rust-test-binary");
    expect(extractTarBinary(tarGzip("swift-rust", executable))).toEqual(executable);
  });

  test("public CLIs run with Bun and builds use the platform temp directory", () => {
    const frameworkCli = readFileSync(
      join(ROOT, "packages", "swift-rust", "bin", "swift-rust.js"),
      "utf8",
    );
    const creatorCli = readFileSync(
      join(ROOT, "packages", "create-swift-rust", "src", "index.ts"),
      "utf8",
    );
    const buildScript = readFileSync(
      join(ROOT, "packages", "swift-rust", "bin", "build.mjs"),
      "utf8",
    );
    expect(frameworkCli.startsWith("#!/usr/bin/env bun")).toBe(true);
    expect(creatorCli.startsWith("#!/usr/bin/env bun")).toBe(true);
    expect(buildScript).toContain("tmpdir()");
    expect(buildScript).not.toContain('"/tmp/swift-rust-build-dev.log"');
  });
});
