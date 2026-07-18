import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import https from "node:https";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, "..");
const RELEASES_URL = process.env.SWIFT_RUST_RELEASES_URL ?? "https://github.com/colesites/swift-rust/releases";
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

export function getPlatform(platform = process.platform, arch = process.arch) {
  const p = `${platform}-${arch}`;
  if (p in PLATFORM_TARGETS) return p;
  throw new Error(`swift-rust: unsupported platform ${p}`);
}

export function binaryName(platform) {
  return platform.startsWith("win32") ? "swift-rust.exe" : "swift-rust";
}

export function assetName(platform) {
  const target = PLATFORM_TARGETS[platform];
  if (!target) throw new Error(`swift-rust: unsupported platform ${platform}`);
  return platform.startsWith("win32")
    ? `swift-rust-${target}.exe`
    : `swift-rust-${target}.tar.gz`;
}

function nativeDir(platform) {
  return join(packageRoot, "native", platform);
}

function getSha256(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

function fetchAsset(url) {
  return new Promise((resolveFetch, rejectFetch) => {
    https.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        const next = res.headers.location;
        if (!next) return rejectFetch(new Error("redirect without location"));
        return resolveFetch(fetchAsset(next));
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

export function extractTarBinary(archive, name = "swift-rust") {
  const tar = gunzipSync(archive);
  for (let offset = 0; offset + 512 <= tar.length; ) {
    const header = tar.subarray(offset, offset + 512);
    const entryName = header.subarray(0, 100).toString("utf8").replace(/\0.*$/, "");
    if (!entryName) break;
    const sizeText = header.subarray(124, 136).toString("ascii").replace(/\0.*$/, "").trim();
    const size = Number.parseInt(sizeText || "0", 8);
    const start = offset + 512;
    const end = start + size;
    if (entryName === name || entryName.endsWith(`/${name}`)) {
      return tar.subarray(start, end);
    }
    offset = start + Math.ceil(size / 512) * 512;
  }
  throw new Error(`swift-rust: ${name} was not found in the downloaded archive`);
}

function tryCargoBuildFallback(platform) {
  const workspaceRoot = resolve(packageRoot, "../..");
  if (!existsSync(join(workspaceRoot, "Cargo.toml"))) {
    return false;
  }
  console.log(`swift-rust: no prebuilt binary for ${platform}, attempting cargo build from ${workspaceRoot}...`);
  try {
    const build = spawnSync(
      "cargo",
      ["build", "--release", "-p", "swift-rust", "--bin", "swift-rust"],
      {
        stdio: "inherit",
        cwd: workspaceRoot,
      },
    );
    if (build.error || build.status !== 0) {
      return false;
    }
  } catch {
    return false;
  }
  const built = join(workspaceRoot, "target", "release", binaryName(platform));
  if (!existsSync(built)) return false;
  const target = join(nativeDir(platform), binaryName(platform));
  mkdirSync(dirname(target), { recursive: true });
  try {
    copyFileSync(built, target);
    if (!platform.startsWith("win32")) chmodSync(target, 0o755);
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
  const target = join(dir, binaryName(platform));
  if (existsSync(target)) return;

  mkdirSync(dir, { recursive: true });
  const url = `${RELEASES_URL}/download/v${VERSION}/${assetName(platform)}`;
  console.log(`swift-rust: downloading ${url}`);

  let archive;
  try {
    archive = await fetchAsset(url);
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

  const binary =
    archive[0] === 0x1f && archive[1] === 0x8b
      ? extractTarBinary(archive, binaryName(platform))
      : archive;
  writeFileSync(target, binary);

  if (!platform.startsWith("win32")) chmodSync(target, 0o755);
  console.log(`swift-rust: installed ${target}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  install().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
