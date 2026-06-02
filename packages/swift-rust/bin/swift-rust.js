#!/usr/bin/env node
import { existsSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { spawn } from "node:child_process";

const here = dirname(realpathSync(fileURLToPath(import.meta.url)));
const packageRoot = resolve(here, "..");
const workspaceRoot = resolve(packageRoot, "../..");
const [, , rawCmd, ...rest] = process.argv;
const cmd = rawCmd || "help";

function findBun() {
  if (process.env.SWIFT_RUST_RUNTIME) return process.env.SWIFT_RUST_RUNTIME;
  if (process.versions && process.versions.bun) {
    return process.execPath;
  }
  const candidates = [
    process.env.BUN_INSTALL ? join(process.env.BUN_INSTALL, "bin", "bun") : null,
    join(process.env.HOME || "", ".bun", "bin", "bun"),
    "/usr/local/bin/bun",
    "/opt/homebrew/bin/bun",
  ].filter(Boolean);
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return process.execPath;
}

if (cmd === "dev") {
  const devScript = join(here, "dev-server.mjs");
  const runtime = findBun();
  const child = spawn(runtime, [devScript, ...process.argv.slice(3)], {
    stdio: "inherit",
    env: process.env,
  });
  const code = await new Promise((r) => {
    child.on("exit", (c) => r(c ?? 1));
    child.on("error", () => r(1));
  });
  process.exit(code);
}

function getBinaryName() {
  if (process.platform === "win32") return "swift-rust.exe";
  return "swift-rust";
}

function findBinary() {
  const name = getBinaryName();
  const candidates = [
    join(packageRoot, "native", `${process.platform}-${process.arch}`, name),
    join(packageRoot, "native", name),
    join(packageRoot, "bin", name),
    join(workspaceRoot, "target", "release", name),
    join(workspaceRoot, "target", "debug", name),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return null;
}

function isMonorepo() {
  return existsSync(join(workspaceRoot, "Cargo.toml"));
}

function cargoRun() {
  const child = spawn(
    "cargo",
    ["run", "--release", "-p", "swift-rust", "--bin", "swift-rust", "--", cmd, ...rest],
    { stdio: "inherit", cwd: workspaceRoot, env: process.env },
  );
  return new Promise((resolveExit) => {
    child.on("exit", (c) => resolveExit(c ?? 1));
    child.on("error", () => resolveExit(1));
  });
}

const bin = findBinary();
if (bin) {
  const child = spawn(bin, process.argv.slice(2), { stdio: "inherit", env: process.env });
  const code = await new Promise((r) => {
    child.on("exit", (c) => r(c ?? 1));
    child.on("error", () => r(1));
  });
  process.exit(code);
}

if (isMonorepo()) {
  const code = await cargoRun();
  process.exit(code);
}

process.stderr.write(`swift-rust: binary not found. In a monorepo, run \`cargo build --release -p swift-rust\`. In a published package, install should have placed the binary in native/<platform>/.\n`);
process.exit(1);
