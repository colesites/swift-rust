import { execSync } from "node:child_process";
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

const HOST_TRIPLE = (() => {
  const p = process.platform;
  const a = process.arch;
  if (p === "darwin" && a === "x64") return "x86_64-apple-darwin";
  if (p === "darwin" && a === "arm64") return "aarch64-apple-darwin";
  if (p === "linux" && a === "x64") return "x86_64-unknown-linux-gnu";
  if (p === "linux" && a === "arm64") return "aarch64-unknown-linux-musl";
  if (p === "win32" && a === "x64") return "x86_64-pc-windows-msvc";
  return null;
})();

const buildAll = process.env.SWIFT_RUST_BUILD_ALL === "1";

function targetForCurrentHost(): Target | null {
  return TARGETS.find((t) => t.triple === HOST_TRIPLE) ?? null;
}

function build(target: Target) {
  const args = ["build", "-p", "swift-rust", "--bin", "swift-rust", "--release", "--target", target.triple];
  console.log(`→ cargo ${args.join(" ")}`);
  execSync(`cargo ${args.join(" ")}`, { stdio: "inherit", cwd: repoRoot });
}

function archive(target: Target) {
  const exe = target.platform.startsWith("win32") ? "swift-rust.exe" : "swift-rust";
  const src = join(repoRoot, "target", target.triple, "release", exe);
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
const targets = buildAll
  ? TARGETS
  : (() => {
      const host = targetForCurrentHost();
      if (!host) {
        console.log(`→ no host triple for ${process.platform}/${process.arch}, building nothing`);
        return [];
      }
      console.log(`→ host ${process.platform}/${process.arch} → building only ${host.triple}`);
      return [host];
    })();

for (const t of targets) {
  try {
    build(t);
  } catch (err) {
    console.error(`✗ failed to build ${t.triple}: ${err.message ?? err}`);
    process.exitCode = 1;
  }
}
for (const t of targets) {
  try {
    archive(t);
  } catch (err) {
    console.error(`✗ failed to archive ${t.triple}: ${err.message ?? err}`);
    process.exitCode = 1;
  }
}
generateManifest(version);
console.log("done");
