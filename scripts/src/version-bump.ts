import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export interface VersionBumpOptions {
  part?: "major" | "minor" | "patch";
  dryRun?: boolean;
  cratesOnly?: boolean;
  packagesOnly?: boolean;
}

const ROOT = process.cwd();

export function bumpVersions(opts: VersionBumpOptions = {}): void {
  const part = opts.part ?? "patch";
  const cargoToml = join(ROOT, "Cargo.toml");
  if (!opts.packagesOnly && existsSync(cargoToml)) {
    const version = bump(readTomlVersion(cargoToml), part);
    console.log(`Cargo workspace ${version}`);
    if (!opts.dryRun) setTomlVersion(cargoToml, version);
  }
  if (!opts.cratesOnly) {
    for (const dir of readdirSync(join(ROOT, "packages"))) {
      const pkg = join(ROOT, "packages", dir, "package.json");
      if (!existsSync(pkg)) continue;
      const data = JSON.parse(readFileSync(pkg, "utf8")) as {
        name: string;
        version: string;
        private?: boolean;
      };
      if (data.private) continue;
      const version = bump(data.version, part);
      console.log(`${data.name} ${data.version} -> ${version}`);
      if (!opts.dryRun) {
        data.version = version;
        writeFileSync(pkg, `${JSON.stringify(data, null, 2)}\n`);
      }
    }
  }
}

function bump(v: string, part: "major" | "minor" | "patch"): string {
  const [maj, min, pat] = v.split(".").map(Number) as [number, number, number];
  if (part === "major") return `${maj + 1}.0.0`;
  if (part === "minor") return `${maj}.${min + 1}.0`;
  return `${maj}.${min}.${pat + 1}`;
}

function readTomlVersion(path: string): string {
  const content = readFileSync(path, "utf8");
  const match = content.match(/^version\s*=\s*"([^"]+)"/m);
  if (!match?.[1]) throw new Error(`no version in ${path}`);
  return match[1];
}

function setTomlVersion(path: string, version: string): void {
  const content = readFileSync(path, "utf8");
  writeFileSync(path, content.replace(/^version\s*=\s*"[^"]+"/m, `version = "${version}"`));
}

if (import.meta.main) {
  const part = (process.argv.find((a) => a.startsWith("--"))?.slice(2) ??
    "patch") as VersionBumpOptions["part"];
  bumpVersions({ part });
}
