import { existsSync, mkdirSync, createWriteStream, writeFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";
import { createGunzip } from "node:zlib";
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import https from "node:https";
import { readFileSync } from "node:fs";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, "..");
const RELEASES_URL = process.env.SWIFT_RUST_RELEASES_URL ?? "https://github.com/swift-rust/swift-rust/releases";
const pkg = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf8"));
const VERSION = process.env.SWIFT_RUST_VERSION ?? pkg.version;

const PLATFORM_TARGETS = {
  "darwin-x64": "x86_64-apple-darwin",
  "darwin-arm64": "aarch64-apple-darwin",
  "linux-x64": "x86_64-unknown-linux-gnu",
  "linux-x64-musl": "x86_64-unknown-linux-musl",
  "linux-arm64": "aarch64-unknown-linux-musl",
  "win32-x64": "x86_64-pc-windows-msvc",
};

function getPlatform() {
  const p = `${process.platform}-${process.arch}`;
  if (p in PLATFORM_TARGETS) return p;
  throw new Error(`swift-rust: unsupported platform ${p}`);
}

function binaryName() {
  return process.platform === "win32" ? "swift-rust.exe" : "swift-rust";
}

function assetName(platform) {
  const target = PLATFORM_TARGETS[platform];
  return process.platform === "win32" ? `swift-rust-${target}.exe.zip` : `swift-rust-${target}.tar.gz`;
}

function nativeDir(platform) {
  return join(packageRoot, "native", platform);
}

function getSha256(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

function fetch(url) {
  return new Promise((resolveFetch, rejectFetch) => {
    https.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        const next = res.headers.location;
        if (!next) return rejectFetch(new Error("redirect without location"));
        return resolveFetch(fetch(next));
      }
      if (res.statusCode !== 200) {
        return rejectFetch(new Error(`HTTP ${res.statusCode} fetching ${url}`));
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolveFetch(Buffer.concat(chunks)));
      res.on("error", rejectFetch);
    }).on("error", rejectFetch);
  });
}

function tryCargoBuildFallback(platform) {
  const workspaceRoot = resolve(packageRoot, "../..");
  if (!existsSync(join(workspaceRoot, "Cargo.toml"))) {
    return false;
  }
  console.log(`swift-rust: no prebuilt binary for ${platform}, attempting cargo build from ${workspaceRoot}...`);
  try {
    execSync("cargo build --release -p swift-rust --bin swift-rust", {
      stdio: "inherit",
      cwd: workspaceRoot,
    });
  } catch {
    return false;
  }
  const built = join(workspaceRoot, "target", "release", binaryName());
  if (!existsSync(built)) return false;
  const target = join(nativeDir(platform), binaryName());
  mkdirSync(dirname(target), { recursive: true });
  try {
    execSync(`cp ${built} ${target}`);
    if (process.platform !== "win32") {
      execSync(`chmod +x ${target}`);
    }
    console.log(`swift-rust: installed ${target} (from cargo build)`);
    return true;
  } catch (e) {
    console.warn(`swift-rust: failed to install binary: ${e.message}`);
    return false;
  }
}

export async function install() {
  if (process.env.SWIFT_RUST_SKIP_POSTINSTALL === "1") {
    return;
  }
  if (process.env.npm_config_local_prefix && existsSync(resolve(packageRoot, "../../Cargo.toml"))) {
    return;
  }
  const platform = getPlatform();
  const dir = nativeDir(platform);
  const target = join(dir, binaryName());
  if (existsSync(target)) return;

  mkdirSync(dir, { recursive: true });
  const url = `${RELEASES_URL}/download/v${VERSION}/${assetName(platform)}`;
  console.log(`swift-rust: downloading ${url}`);

  let archive;
  try {
    archive = await fetch(url);
  } catch (e) {
    if (tryCargoBuildFallback(platform)) return;
    console.warn(`swift-rust: postinstall could not fetch binary: ${e.message}`);
    console.warn(`swift-rust: the bin will try again on first run, or you can build with: cargo build --release -p swift-rust`);
    return;
  }

  const expectedSha = process.env.SWIFT_RUST_EXPECTED_SHA256;
  if (expectedSha && getSha256(archive) !== expectedSha) {
    throw new Error("swift-rust: downloaded archive hash mismatch");
  }

  if (archive[0] === 0x1f && archive[1] === 0x8b) {
    const out = join(dir, "extract");
    mkdirSync(out, { recursive: true });
    await pipeline(Buffer.from(archive), createGunzip(), createWriteStream(join(out, "asset.tar")));
    execSync(`tar -xf ${join(out, "asset.tar")} -C ${out}`);
    execSync(`mv ${join(out, "swift-rust")} ${target}`);
  } else {
    writeFileSync(target, archive);
  }

  if (process.platform !== "win32") {
    execSync(`chmod +x ${target}`);
  }
  console.log(`swift-rust: installed ${target}`);
}

if (import.meta.main) {
  install().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
