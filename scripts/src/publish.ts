import { spawn } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const PUBLISH_ORDER = [
  "@swift-rust/env",
  "@swift-rust/eslint-config",
  "@swift-rust/eslint-plugin",
  "@swift-rust/font",
  "@swift-rust/bundle-analyzer",
  "@swift-rust/codemod",
  "@swift-rust/mdx",
  "create-swift-rust",
];

interface PackageJson {
  name: string;
  version: string;
  private?: boolean;
  dependencies?: Record<string, string>;
}

export async function publish(): Promise<void> {
  const root = process.cwd();
  const changesets = existsSync(join(root, ".changeset"));
  if (!changesets) throw new Error("no .changeset directory");

  for (const name of PUBLISH_ORDER) {
    const dir = findPackageDir(root, name);
    if (!dir) {
      console.warn(`skip: ${name} not found`);
      continue;
    }
    const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8")) as PackageJson;
    if (pkg.private) {
      console.log(`skip private: ${name}`);
      continue;
    }
    if (!existsSync(join(dir, "dist"))) {
      throw new Error(`${name} has no dist/ — run build first`);
    }
    console.log(`→ publishing ${name}@${pkg.version}`);
    await run("bun", ["publish", "--access", "public"], { cwd: dir });
  }
}

function findPackageDir(root: string, name: string): string | null {
  const candidates = [join(root, "packages"), join(root, "packages")];
  for (const base of candidates) {
    if (!existsSync(base)) continue;
    for (const entry of readdirSync(base)) {
      const p = join(base, entry, "package.json");
      if (!existsSync(p)) continue;
      const pkg = JSON.parse(readFileSync(p, "utf8")) as PackageJson;
      if (pkg.name === name) return join(base, entry);
    }
  }
  return null;
}

function run(cmd: string, args: string[], opts: { cwd: string }): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit", cwd: opts.cwd });
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`)),
    );
    child.on("error", reject);
  });
}

if (import.meta.main) await publish();
