import { execSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync, statSync } from "node:fs";
import { join, resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "../..");
const packageRoot = resolve(here, "..");
const outDir = join(packageRoot, "native");

interface Target {
  triple: string;
  platform: string;
  ext: "tar.gz" | "zip";
}

const TARGETS: Target[] = [
  { triple: "x86_64-unknown-linux-gnu", platform: "linux-x64", ext: "tar.gz" },
  { triple: "x86_64-unknown-linux-musl", platform: "linux-x64-musl", ext: "tar.gz" },
  { triple: "aarch64-unknown-linux-musl", platform: "linux-arm64", ext: "tar.gz" },
  { triple: "x86_64-apple-darwin", platform: "darwin-x64", ext: "tar.gz" },
  { triple: "aarch64-apple-darwin", platform: "darwin-arm64", ext: "tar.gz" },
  { triple: "x86_64-pc-windows-msvc", platform: "win32-x64", ext: "zip" },
];

function build(target: Target) {
  const args = ["build", "-p", "swift-rust", "--bin", "swift-rust", "--release", "--target", target.triple];
  console.log(`→ cargo ${args.join(" ")}`);
  execSync(`cargo ${args.join(" ")}}`, { stdio: "inherit", cwd: repoRoot });
}

function archive(target: Target) {
  const src = join(repoRoot, "target", target.triple, "release", target.platform.startsWith("win32") ? "swift-rust.exe" : "swift-rust");
  if (!existsSync(src)) throw new Error(`built binary not found at ${src}`);
  const out = join(outDir, `swift-rust-${target.triple}.${target.ext}`);
  mkdirSync(outDir, { recursive: true });
  if (target.ext === "tar.gz") {
    const dir = dirname(src);
    const base = basename(src);
    execSync(`tar -C ${dir} -czf ${out} ${base}`);
  } else {
    execSync(`cd ${dirname(src)} && zip -j ${out} ${basename(src)}`);
  }
  return out;
}

function generateManifest(version: string) {
  const manifest: Record<string, { url: string; sha256: string; size: number }> = {};
  for (const t of TARGETS) {
    const file = `swift-rust-${t.triple}.${t.ext}`;
    const full = join(outDir, file);
    if (!existsSync(full)) continue;
    const size = statSync(full).size;
    const sha256 = execSync(`shasum -a 256 ${full}`).toString().split(" ")[0];
    manifest[t.platform] = {
      url: `https://github.com/swift-rust/swift-rust/releases/download/v${version}/${file}`,
      sha256,
      size,
    };
  }
  writeFileSync(join(outDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`→ wrote ${join(outDir, "manifest.json")}`);
}

const version = process.env.SWIFT_RUST_VERSION ?? require("../package.json").version;
for (const t of TARGETS) build(t);
for (const t of TARGETS) archive(t);
generateManifest(version);
console.log("done");
