import { spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const TARGETS = [
  { triple: "x86_64-unknown-linux-gnu", os: "linux", arch: "x64" },
  { triple: "x86_64-unknown-linux-musl", os: "linux", arch: "x64-musl" },
  { triple: "aarch64-unknown-linux-musl", os: "linux", arch: "arm64-musl" },
  { triple: "x86_64-apple-darwin", os: "darwin", arch: "x64" },
  { triple: "aarch64-apple-darwin", os: "darwin", arch: "arm64" },
  { triple: "x86_64-pc-windows-msvc", os: "win32", arch: "x64" },
] as const;

type TargetTriple = (typeof TARGETS)[number]["triple"];

const OUT_DIR = "target/dist";

export interface BuildNativeOptions {
  release?: boolean;
  target?: TargetTriple;
  binary?: string;
}

export async function buildNative(opts: BuildNativeOptions = {}): Promise<void> {
  mkdirSync(OUT_DIR, { recursive: true });
  const targets = opts.target ? TARGETS.filter((t) => t.triple === opts.target) : TARGETS;
  for (const t of targets) {
    const args = ["build", "-p", "swift-rust", "--bin", opts.binary ?? "swift-rust"];
    if (opts.release ?? true) args.push("--release");
    args.push("--target", t.triple);
    console.log(`→ cargo ${args.join(" ")}`);
    await run("cargo", args);
  }
}

function run(cmd: string, args: string[]): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit" });
    child.on("exit", (code) =>
      code === 0 ? resolve(code ?? 0) : reject(new Error(`${cmd} exited ${code}`)),
    );
    child.on("error", reject);
  });
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const targetArg = args.find((a) => a.startsWith("--target="))?.split("=")[1];
  const target = TARGETS.find((t) => t.triple === targetArg)?.triple;
  await buildNative({ target, release: !args.includes("--debug") });
}
