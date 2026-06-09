#!/usr/bin/env node
import { existsSync, readFileSync, realpathSync } from "node:fs";
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

if (cmd === "build") {
  const buildScript = join(here, "build.mjs");
  const runtime = findBun();
  const child = spawn(runtime, [buildScript, ...process.argv.slice(3)], {
    stdio: "inherit",
    env: process.env,
  });
  const code = await new Promise((r) => {
    child.on("exit", (c) => r(c ?? 1));
    child.on("error", () => r(1));
  });
  process.exit(code);
}

if (cmd === "upgrade" || cmd === "update") {
  const projectDir = process.cwd();
  const args = process.argv.slice(3);

  if (args.includes("--help") || args.includes("-h")) {
    process.stdout.write(
      `swift-rust upgrade — update swift-rust to the latest release.\n\n` +
        `Usage:\n` +
        `  swift-rust upgrade            update to the latest stable\n` +
        `  swift-rust upgrade <tag>      update to a dist-tag (e.g. canary) or version (e.g. 1.6.0)\n` +
        `  swift-rust upgrade --tag <t>  same, explicit flag\n\n` +
        `Detects your package manager from the lockfile (bun/pnpm/npm/yarn).\n` +
        `The @swift-rust/* packages (font, image, pdf, video, env) update transitively.\n`,
    );
    process.exit(0);
  }

  // Resolve the target tag/version: a bare arg, or --tag <t>, else "latest".
  let target = "latest";
  const tagIdx = args.indexOf("--tag");
  if (tagIdx !== -1 && args[tagIdx + 1]) target = args[tagIdx + 1];
  else {
    const bare = args.find((a) => !a.startsWith("-"));
    if (bare) target = bare;
  }

  // Detect the package manager from the lockfile in the project.
  const pm =
    existsSync(join(projectDir, "bun.lock")) || existsSync(join(projectDir, "bun.lockb"))
      ? "bun"
      : existsSync(join(projectDir, "pnpm-lock.yaml"))
        ? "pnpm"
        : existsSync(join(projectDir, "yarn.lock"))
          ? "yarn"
          : existsSync(join(projectDir, "package-lock.json"))
            ? "npm"
            : "bun";

  const readInstalledVersion = () => {
    try {
      const pkgPath = join(projectDir, "node_modules", "swift-rust", "package.json");
      if (existsSync(pkgPath)) {
        return JSON.parse(readFileSync(pkgPath, "utf8")).version;
      }
    } catch {}
    return null;
  };

  if (!existsSync(join(projectDir, "package.json"))) {
    process.stderr.write("swift-rust upgrade: no package.json here — run this inside your project.\n");
    process.exit(1);
  }

  const before = readInstalledVersion();
  const spec = `swift-rust@${target}`;
  const addArgs = pm === "npm" ? ["install", spec] : ["add", spec];
  process.stdout.write(`↻ Upgrading ${spec} with ${pm}${before ? ` (current: ${before})` : ""}…\n`);

  const child = spawn(pm, addArgs, { stdio: "inherit", cwd: projectDir, env: process.env });
  const code = await new Promise((r) => {
    child.on("exit", (c) => r(c ?? 1));
    child.on("error", (e) => {
      process.stderr.write(`swift-rust upgrade: failed to run ${pm} (${e.message}).\n`);
      r(1);
    });
  });
  if (code === 0) {
    const after = readInstalledVersion();
    if (after && before && after !== before) process.stdout.write(`✓ swift-rust ${before} → ${after}\n`);
    else if (after) process.stdout.write(`✓ swift-rust on ${after}\n`);
    else process.stdout.write(`✓ done — restart your dev server to pick up the new runtime.\n`);
  }
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
