import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { Glob } from "bun";

const ROOT = join(import.meta.dir, "..", "..");

type Pkg = { name?: string; bin?: string | Record<string, string> };

/**
 * Every workspace listed here is installed into the *same* hoisted
 * `node_modules/.bin`, so two packages that claim the same bin name clobber
 * each other (last writer wins). That is exactly how `@swift-rust/ui` once
 * stole the `swift-rust` command from the framework and broke `swift-rust dev`.
 */
function workspacePackageJsonPaths(): string[] {
  const root = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")) as {
    workspaces: string[];
  };
  const files = new Set<string>();
  for (const pattern of root.workspaces) {
    for (const rel of new Glob(`${pattern}/package.json`).scanSync({ cwd: ROOT })) {
      if (rel.includes("node_modules")) continue;
      files.add(join(ROOT, rel));
    }
  }
  return [...files];
}

/** Resolve the command names a package installs onto the PATH. */
function binNames(pkg: Pkg): string[] {
  if (!pkg.bin) return [];
  if (typeof pkg.bin === "string") {
    // A string bin is installed under the (unscoped) package name.
    return [pkg.name ? basename(pkg.name) : ""];
  }
  return Object.keys(pkg.bin);
}

describe("workspace bin names", () => {
  test("no two packages declare the same CLI bin name", () => {
    const owners = new Map<string, string[]>();

    for (const file of workspacePackageJsonPaths()) {
      const pkg = JSON.parse(readFileSync(file, "utf8")) as Pkg;
      const where = pkg.name ?? dirname(file);
      for (const name of binNames(pkg)) {
        if (!name) continue;
        owners.set(name, [...(owners.get(name) ?? []), where]);
      }
    }

    const collisions = [...owners.entries()].filter(([, pkgs]) => pkgs.length > 1);
    const report = collisions
      .map(([bin, pkgs]) => `  "${bin}" declared by: ${pkgs.join(", ")}`)
      .join("\n");

    expect(report, `Duplicate bin names will clobber each other on install:\n${report}`).toBe("");
  });
});
