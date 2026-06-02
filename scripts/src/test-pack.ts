import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export interface TestPackOptions {
  packageDir: string;
  keep?: boolean;
}

export async function testPack(opts: TestPackOptions): Promise<void> {
  const tmp = mkdtempSync(join(tmpdir(), "swift-rust-test-pack-"));
  try {
    console.log(`packing into ${tmp}`);
    await run("bun", ["pm", "pack"], { cwd: opts.packageDir });
    const tarball = findTarball(opts.packageDir);
    await run("tar", ["-xzf", tarball, "-C", tmp], { cwd: tmp });
    const extracted = join(tmp, "package");
    if (!existsSync(extracted)) throw new Error("extracted package directory not found");
    console.log(`→ installing in ${extracted}`);
    await run("bun", ["install"], { cwd: extracted });
    const tsc = await run("bunx", ["tsc", "--noEmit"], { cwd: extracted });
    if (tsc !== 0) throw new Error("typecheck failed");
    console.log("✓ test-pack passed");
    if (opts.keep) console.log(`kept at ${tmp}`);
  } finally {
    if (!opts.keep) rmSync(tmp, { recursive: true, force: true });
  }
}

function findTarball(dir: string): string {
  const { spawnSync } = require("node:child_process") as typeof import("node:child_process");
  const res = spawnSync("ls", [dir], { encoding: "utf8" });
  for (const line of res.stdout.split("\n")) {
    if (line.endsWith(".tgz")) return join(dir, line);
  }
  throw new Error("no tarball found");
}

function run(cmd: string, args: string[], opts: { cwd: string }): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit", cwd: opts.cwd });
    child.on("exit", (code) => resolve(code ?? 1));
    child.on("error", reject);
  });
}

if (import.meta.main) {
  const dir = process.argv[2];
  if (!dir) {
    console.error("usage: bun test-pack.ts <package-dir>");
    process.exit(1);
  }
  await testPack({ packageDir: dir });
}
