#!/usr/bin/env node
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as p from "@clack/prompts";
import pc from "picocolors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PACKAGE_ROOT = join(__dirname, "..");
const REGISTRY_DIR = join(PACKAGE_ROOT, "registry");

type ComponentMap = Record<string, { files: string[]; dependencies?: string[] }>;

const COMPONENTS: ComponentMap = {
  accordion: { files: ["accordion.tsx"] },
  alert: { files: ["alert.tsx"] },
  avatar: { files: ["avatar.tsx"] },
  badge: { files: ["badge.tsx"] },
  breadcrumb: { files: ["breadcrumb.tsx"] },
  button: { files: ["button.tsx"] },
  callout: { files: ["callout.tsx"] },
  card: { files: ["card.tsx"] },
  checkbox: { files: ["checkbox.tsx"] },
  code: { files: ["code.tsx"] },
  command: { files: ["command.tsx"] },
  dialog: { files: ["dialog.tsx"] },
  "dropdown-menu": { files: ["dropdown-menu.tsx"] },
  form: { files: ["form.tsx"] },
  input: { files: ["input.tsx"] },
  kbd: { files: ["kbd.tsx"] },
  label: { files: ["label.tsx"] },
  "navigation-menu": { files: ["navigation-menu.tsx"] },
  pagination: { files: ["pagination.tsx"] },
  popover: { files: ["popover.tsx"] },
  progress: { files: ["progress.tsx"] },
  "radio-group": { files: ["radio-group.tsx"] },
  select: { files: ["select.tsx"] },
  separator: { files: ["separator.tsx"] },
  sheet: { files: ["sheet.tsx"] },
  skeleton: { files: ["skeleton.tsx"] },
  slider: { files: ["slider.tsx"] },
  spinner: { files: ["spinner.tsx"] },
  switch: { files: ["switch.tsx"] },
  table: { files: ["table.tsx"] },
  tabs: { files: ["tabs.tsx"] },
  textarea: { files: ["textarea.tsx"] },
  toast: { files: ["toast.tsx"] },
  toggle: { files: ["toggle.tsx"] },
  tooltip: { files: ["tooltip.tsx"] },
};

const UTILS_FILE = join(REGISTRY_DIR, "lib", "utils.ts");

const HELP = `
${pc.bold("swift-rust")} ${pc.dim("— add UI components to your project")}

${pc.bold("Usage")}
  ${pc.cyan("swift-rust add [components...] [options]")}
  ${pc.cyan("swift-rust init [options]")}
  ${pc.cyan("swift-rust list")}

${pc.bold("Commands")}
  ${pc.yellow("add")}       Add one or more components to your project
  ${pc.yellow("init")}      Initialize the UI registry in your project
  ${pc.yellow("list")}      List all available components
  ${pc.yellow("help")}      Show this help

${pc.bold("Options for add")}
  ${pc.yellow("--all")}                   Add all components
  ${pc.yellow("--dir <path>")}            Target directory (default: "components/ui")
  ${pc.yellow("--yes, -y")}               Skip confirmation prompts
  ${pc.yellow("--overwrite")}             Overwrite existing files

${pc.bold("Options for init")}
  ${pc.yellow("--dir <path>")}            Target directory (default: "lib")
  ${pc.yellow("--yes, -y")}               Skip confirmation prompts

${pc.bold("Examples")}
  ${pc.cyan("swift-rust init")}
  ${pc.cyan("swift-rust add button card input")}
  ${pc.cyan("swift-rust add --all")}
  ${pc.cyan("swift-rust add dialog --dir src/components/ui")}
`;

async function pathExists(path: string): Promise<boolean> {
  try {
    await readFile(path);
    return true;
  } catch {
    return false;
  }
}

async function findProjectRoot(cwd: string): Promise<string> {
  let current = cwd;
  const root = resolve("/");
  while (current !== root) {
    const pkgPath = join(current, "package.json");
    if (await pathExists(pkgPath)) {
      try {
        const pkgRaw = await readFile(pkgPath, "utf8");
        const pkg = JSON.parse(pkgRaw) as { dependencies?: Record<string, string> };
        if (pkg.dependencies?.["swift-rust"] || pkg.dependencies?.["@swift-rust/ui"]) {
          return current;
        }
      } catch {
        // ignore
      }
    }
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return cwd;
}

interface PackageJson {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

async function readPackageJson(dir: string): Promise<PackageJson> {
  const path = join(dir, "package.json");
  const raw = await readFile(path, "utf8");
  return JSON.parse(raw) as PackageJson;
}

async function writePackageJson(dir: string, pkg: PackageJson): Promise<void> {
  const path = join(dir, "package.json");
  await writeFile(path, `${JSON.stringify(pkg, null, 2)}\n`);
}

async function ensureDependencies(
  projectRoot: string,
  deps: string[],
): Promise<{ added: string[]; alreadyPresent: string[] }> {
  const pkg = await readPackageJson(projectRoot);
  const existing = new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
  ]);
  const toAdd = deps.filter((d) => !existing.has(d));
  if (toAdd.length === 0) {
    return { added: [], alreadyPresent: deps };
  }
  pkg.dependencies = pkg.dependencies ?? {};
  for (const dep of toAdd) {
    pkg.dependencies[dep] = "latest";
  }
  await writePackageJson(projectRoot, pkg);
  return { added: toAdd, alreadyPresent: deps.filter((d) => existing.has(d)) };
}

async function detectImportAlias(projectRoot: string): Promise<string> {
  const tsconfigPath = join(projectRoot, "tsconfig.json");
  if (!(await pathExists(tsconfigPath))) return "@/*";
  try {
    const raw = await readFile(tsconfigPath, "utf8");
    const json = JSON.parse(raw) as {
      compilerOptions?: { paths?: Record<string, string[]> };
    };
    const paths = json.compilerOptions?.paths ?? {};
    for (const key of Object.keys(paths)) {
      if (
        key.endsWith("/*") &&
        paths[key]?.some((p) => p.endsWith("/*") || p.endsWith("/src/*") || p.endsWith("*"))
      ) {
        return key;
      }
    }
  } catch {
    // ignore
  }
  return "@/*";
}

async function ensureTsconfigPath(
  projectRoot: string,
  alias: string,
  srcDir: boolean,
): Promise<void> {
  const tsconfigPath = join(projectRoot, "tsconfig.json");
  if (!(await pathExists(tsconfigPath))) return;
  const raw = await readFile(tsconfigPath, "utf8");
  const json = JSON.parse(raw) as {
    compilerOptions?: { baseUrl?: string; paths?: Record<string, string[]> };
  };
  const aliasKey = alias.replace("/*", "");
  const current = json.compilerOptions ?? {};
  const paths = current.paths ?? {};
  if (!Object.keys(paths).some((k) => k === alias.replace("/*", ""))) {
    paths[aliasKey] = srcDir ? ["./src/*"] : ["./*"];
    current.paths = paths;
    if (!current.baseUrl) current.baseUrl = ".";
    json.compilerOptions = current;
    await writeFile(tsconfigPath, `${JSON.stringify(json, null, 2)}\n`);
  }
}

async function copyFile(
  src: string,
  dest: string,
  overwrite: boolean,
): Promise<"created" | "skipped" | "overwritten"> {
  if (await pathExists(dest)) {
    if (!overwrite) return "skipped";
  }
  await mkdir(dirname(dest), { recursive: true });
  const content = await readFile(src, "utf8");
  await writeFile(dest, content);
  return overwrite ? "overwritten" : "created";
}

async function installComponent(
  projectRoot: string,
  name: string,
  targetDir: string,
  overwrite: boolean,
): Promise<{ status: string; files: string[] }> {
  const entry = COMPONENTS[name];
  if (!entry) throw new Error(`Unknown component: ${name}`);
  const files: string[] = [];
  for (const file of entry.files) {
    const src = join(REGISTRY_DIR, "components", file);
    const dest = join(projectRoot, targetDir, file);
    const result = await copyFile(src, dest, overwrite);
    files.push(`${result === "skipped" ? pc.yellow("~") : pc.green("+")} ${file}`);
  }
  return { status: "added", files };
}

async function installUtils(
  projectRoot: string,
  targetDir: string,
  overwrite: boolean,
): Promise<string> {
  const dest = join(projectRoot, targetDir, "utils.ts");
  const result = await copyFile(UTILS_FILE, dest, overwrite);
  return `${result === "skipped" ? pc.yellow("~") : pc.green("+")} ${join(targetDir, "utils.ts")}`;
}

export async function init(
  options: { cwd?: string; dir?: string; yes?: boolean; overwrite?: boolean } = {},
): Promise<void> {
  return runInit(options.cwd ?? process.cwd(), {
    dir: options.dir,
    yes: options.yes,
    overwrite: options.overwrite,
  });
}

export async function add(options: {
  cwd?: string;
  names?: string[];
  all?: boolean;
  targetDir?: string;
  yes?: boolean;
  overwrite?: boolean;
}): Promise<void> {
  return runAddInternal(options.cwd ?? process.cwd(), options.names ?? [], {
    all: options.all,
    dir: options.targetDir,
    yes: options.yes,
    overwrite: options.overwrite,
  });
}

export async function list(): Promise<void> {
  return runList();
}

async function runInit(
  cwd: string,
  options: { dir?: string; yes?: boolean; overwrite?: boolean },
): Promise<void> {
  const projectRoot = await findProjectRoot(cwd);
  p.log.info(`Project root: ${pc.cyan(projectRoot)}`);

  const targetDir = options.dir ?? "lib";
  const alias = await detectImportAlias(projectRoot);
  const srcDir = alias.includes("src");

  const utilsDest = join(targetDir, "utils.ts");
  const overwrite = options.overwrite === true;
  const yes = options.yes === true;

  if (!yes) {
    const proceed = await p.confirm({
      message: `Install ${pc.cyan("lib/utils.ts")} to ${pc.cyan(join(projectRoot, utilsDest))}?`,
      initialValue: true,
    });
    if (p.isCancel(proceed) || !proceed) {
      p.cancel("Aborted.");
      process.exit(1);
    }
  }

  const spinner = p.spinner();
  spinner.start("Installing utilities");
  const result = await installUtils(projectRoot, targetDir, overwrite);
  await ensureDependencies(projectRoot, ["clsx", "tailwind-merge"]);
  await ensureTsconfigPath(projectRoot, alias, srcDir);
  spinner.stop("Installed utilities");

  p.log.success(result);
  p.log.info(pc.dim("Dependencies added: clsx, tailwind-merge"));
  p.outro(
    `${pc.green("Done!")} Now run ${pc.cyan("swift-rust add <component>")} to add components.`,
  );
}

async function runAddInternal(
  cwd: string,
  names: string[],
  options: { all?: boolean; dir?: string; yes?: boolean; overwrite?: boolean },
): Promise<void> {
  const projectRoot = await findProjectRoot(cwd);
  p.log.info(`Project root: ${pc.cyan(projectRoot)}`);

  const targetDir = options.dir ?? "components/ui";
  const overwrite = options.overwrite === true;
  const yes = options.yes === true;

  let namesToAdd = names;
  if (options.all) {
    namesToAdd = Object.keys(COMPONENTS);
  }

  if (names.length === 0) {
    if (yes) {
      p.log.error("No components specified. Use --all or pass component names.");
      process.exit(1);
    }
    const selected = await p.multiselect({
      message: "Which components would you like to add?",
      options: Object.keys(COMPONENTS).map((name) => ({
        value: name,
        label: name,
      })),
      required: true,
    });
    if (p.isCancel(selected) || !Array.isArray(selected) || selected.length === 0) {
      p.cancel("Aborted.");
      process.exit(1);
    }
    namesToAdd = selected as string[];
  }

  const invalid = namesToAdd.filter((n) => !COMPONENTS[n]);
  if (invalid.length > 0) {
    p.log.error(`Unknown component${invalid.length > 1 ? "s" : ""}: ${invalid.join(", ")}`);
    p.log.info(`Run ${pc.cyan("swift-rust list")} to see all available components.`);
    process.exit(1);
  }

  if (!yes) {
    const proceed = await p.confirm({
      message: `Add ${pc.cyan(namesToAdd.join(", "))} to ${pc.cyan(join(projectRoot, targetDir))}?`,
      initialValue: true,
    });
    if (p.isCancel(proceed) || !proceed) {
      p.cancel("Aborted.");
      process.exit(1);
    }
  }

  const hasUtils = await pathExists(join(projectRoot, "lib", "utils.ts"));
  if (!hasUtils && !yes) {
    const runInitPrompt = await p.confirm({
      message: `${pc.yellow("lib/utils.ts")} is missing. Run ${pc.cyan("swift-rust init")} first?`,
      initialValue: true,
    });
    if (!p.isCancel(runInitPrompt) && runInitPrompt) {
      await runInit(cwd, { dir: "lib", yes: true });
    }
  } else if (!hasUtils) {
    await runInit(cwd, { dir: "lib", yes: true });
  }

  const spinner = p.spinner();
  spinner.start(`Adding ${namesToAdd.length} component${namesToAdd.length > 1 ? "s" : ""}`);

  const results: string[] = [];
  for (const name of namesToAdd) {
    try {
      const { files } = await installComponent(projectRoot, name, targetDir, overwrite);
      results.push(...files);
    } catch (err) {
      p.log.error(`Failed to add ${name}: ${(err as Error).message}`);
    }
  }

  spinner.stop(`Added ${namesToAdd.length} component${namesToAdd.length > 1 ? "s" : ""}`);
  p.log.message(results.join("\n"));
  p.outro(`${pc.green("Done!")} Components are ready in ${pc.cyan(targetDir)}.`);
}

async function runList(): Promise<void> {
  const names = Object.keys(COMPONENTS).sort();
  p.log.message(`${pc.bold(pc.cyan(`${names.length} components available:`))}\n`);
  const groups: Record<string, string[]> = {
    Forms: [
      "button",
      "input",
      "textarea",
      "checkbox",
      "radio-group",
      "select",
      "switch",
      "slider",
      "label",
      "form",
    ],
    Layout: [
      "card",
      "separator",
      "tabs",
      "accordion",
      "sheet",
      "dialog",
      "popover",
      "dropdown-menu",
      "navigation-menu",
      "breadcrumb",
      "pagination",
    ],
    Feedback: ["alert", "callout", "toast", "spinner", "skeleton", "progress"],
    Display: ["avatar", "badge", "kbd", "code", "table", "command", "toggle"],
  };
  for (const [group, groupNames] of Object.entries(groups)) {
    p.log.message(`  ${pc.bold(group)}: ${groupNames.map((n) => pc.cyan(n)).join(", ")}`);
  }
}

function parseArgs(args: string[]): Record<string, string | boolean | string[]> {
  const flags: Record<string, string | boolean | string[]> = { _: [] };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === undefined) continue;
    if (a === "--all") flags.all = true;
    else if (a === "--yes" || a === "-y") flags.yes = true;
    else if (a === "--overwrite") flags.overwrite = true;
    else if (a === "--dir") {
      const next = args[++i];
      if (next !== undefined) flags.dir = next;
    } else if (a === "--help" || a === "-h") flags.help = true;
    else if (!a.startsWith("-")) {
      const arr = (flags._ as string[]) ?? [];
      arr.push(a);
      flags._ = arr;
    }
  }
  return flags;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log(HELP);
    process.exit(args.length === 0 ? 1 : 0);
  }

  const command = args[0];
  const flags = parseArgs(args.slice(1));

  p.intro(pc.bgCyan(pc.black(" swift-rust ui ")));

  try {
    if (command === "add") {
      const names = (flags._ as string[]) ?? [];
      await runAddInternal(process.cwd(), names, {
        all: flags.all === true,
        dir: typeof flags.dir === "string" ? flags.dir : undefined,
        yes: flags.yes === true,
        overwrite: flags.overwrite === true,
      });
    } else if (command === "init") {
      await runInit(process.cwd(), {
        dir: typeof flags.dir === "string" ? flags.dir : undefined,
        yes: flags.yes === true,
        overwrite: flags.overwrite === true,
      });
    } else if (command === "list") {
      await runList();
    } else if (command === "help") {
      console.log(HELP);
    } else {
      p.log.error(`Unknown command: ${command}`);
      console.log(HELP);
      process.exit(1);
    }
  } catch (err) {
    p.log.error((err as Error).message);
    process.exit(1);
  }
}

if (import.meta.main) {
  main().catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  });
}
