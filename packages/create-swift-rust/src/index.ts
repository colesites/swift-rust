#!/usr/bin/env node
import { existsSync } from "node:fs";
import { cp, mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as p from "@clack/prompts";
import pc from "picocolors";

/** Locate the bundled template dir, both from src/ (dev) and dist/ (published). */
function templateDir(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  for (const candidate of [
    resolve(here, "..", "templates", "default"),
    resolve(here, "templates", "default"),
  ]) {
    if (existsSync(candidate)) return candidate;
  }
  return resolve(here, "..", "templates", "default");
}

/**
 * Copy the full-demo template into `target`, restoring underscore-prefixed
 * dotfiles and substituting the project name placeholder.
 */
async function copyTemplate(target: string, projectName: string): Promise<void> {
  const src = templateDir();
  if (!existsSync(src)) {
    throw new Error(
      `Template not found at ${src}. Run \`node scripts/sync-template.mjs\` before publishing.`,
    );
  }
  await mkdir(target, { recursive: true });
  await cp(src, target, { recursive: true });

  // Restore real dotfile names (npm mangles dotfiles inside packages).
  const dotfiles: Array<[string, string]> = [
    ["_gitignore", ".gitignore"],
    ["_env.example", ".env.example"],
    ["_env.local", ".env.local"],
  ];
  for (const [from, to] of dotfiles) {
    const fromPath = join(target, from);
    if (existsSync(fromPath)) await rename(fromPath, join(target, to));
  }

  // Substitute the project name in package.json + README.
  const displayName = projectName === "." ? basename(resolve(target)) : projectName;
  for (const file of ["package.json", "README.md"]) {
    const path = join(target, file);
    if (!existsSync(path)) continue;
    const contents = await readFile(path, "utf8");
    await writeFile(path, contents.split("__PROJECT_NAME__").join(displayName));
  }

  // Editor config: silence the built-in CSS linter's false "Unknown at rule"
  // warnings on Tailwind v4 at-rules, and recommend the Tailwind extension.
  await mkdir(join(target, ".vscode"), { recursive: true });
  await writeFile(
    join(target, ".vscode", "settings.json"),
    `${JSON.stringify(
      {
        "css.lint.unknownAtRules": "ignore",
        "scss.lint.unknownAtRules": "ignore",
        "less.lint.unknownAtRules": "ignore",
      },
      null,
      2,
    )}\n`,
  );
  await writeFile(
    join(target, ".vscode", "extensions.json"),
    `${JSON.stringify({ recommendations: ["bradlc.vscode-tailwindcss", "biomejs.biome"] }, null, 2)}\n`,
  );
}

type Language = "ts" | "js";
type Linter = "biome" | "eslint";
type Renderer = "ssr" | "ssr-wasm" | "ssr-htmx" | "wasm";

interface Answers {
  projectName: string;
  language: Language;
  renderer: Renderer;
  linter: Linter;
  tailwind: boolean;
  srcDir: boolean;
  importAlias: string;
  useShadcn: boolean;
  install: boolean;
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

function isValidName(name: string): boolean {
  return /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name);
}

/** ".", "./", "" all mean "scaffold into the current directory". */
function isCurrentDir(name: string): boolean {
  const t = name.trim();
  return t === "." || t === "./" || t === "";
}
/** Normalize a project-name input: current-dir variants → ".", strip trailing slashes. */
function normalizeProjectName(name: string): string {
  const t = name.trim();
  if (isCurrentDir(t)) return ".";
  return t.replace(/\/+$/, "");
}

const HELP = `
${pc.bold("create-swift-rust")} - scaffold a new swift-rust project

${pc.bold("Usage")}
  ${pc.cyan("bun create swift-rust@latest")} [project-name] [options]

Scaffolds the full-demo starter: blog, dashboard, API routes, and the
Image / PDF / Video / Font components — TypeScript, Tailwind, Biome, src/app.

${pc.bold("Options")}
  ${pc.yellow("--install")}               Run bun install after scaffolding
  ${pc.yellow("--no-install")}            Skip bun install (default)
  ${pc.yellow("--yes, -y")}               Skip prompts, use defaults
  ${pc.yellow("--help, -h")}              Show this help

${pc.bold("Examples")}
  ${pc.cyan("bun create swift-rust@latest")}
  ${pc.cyan("bun create swift-rust@latest my-app --install")}
  ${pc.cyan("bun create swift-rust@latest ./")}
`;

function parseFlags(args: string[]): Record<string, string | boolean | undefined> {
  const flags: Record<string, string | boolean | undefined> = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === undefined) continue;
    if (a === "--ts" || a === "--typescript") flags.language = "ts";
    else if (a === "--js" || a === "--javascript") flags.language = "js";
    else if (a === "--tailwind") flags.tailwind = true;
    else if (a === "--no-tailwind") flags.tailwind = false;
    else if (a === "--shadcn") flags.useShadcn = true;
    else if (a === "--no-shadcn") flags.useShadcn = false;
    else if (a === "--src-dir") flags.srcDir = true;
    else if (a === "--no-src-dir") flags.srcDir = false;
    else if (a === "--biome") flags.linter = "biome";
    else if (a === "--eslint") flags.linter = "eslint";
    else if (a === "--import-alias") flags.importAlias = args[++i];
    else if (a === "--ssr") flags.renderer = "ssr";
    else if (a === "--ssr-wasm") flags.renderer = "ssr-wasm";
    else if (a === "--ssr-htmx") flags.renderer = "ssr-htmx";
    else if (a === "--wasm") flags.renderer = "wasm";
    else if (a === "--renderer") flags.renderer = args[++i];
    else if (a === "--install") flags.install = true;
    else if (a === "--no-install") flags.install = false;
    else if (a === "--yes" || a === "-y") flags.yes = true;
    else if (a === "--help" || a === "-h") flags.help = true;
    else if (!a.startsWith("-") && !flags._name) flags._name = a as string;
  }
  return flags;
}

async function askQuestions(
  flags: Record<string, string | boolean | undefined>,
  positional: string | undefined,
): Promise<Answers | null> {
  const yesMode = flags.yes === true;

  const projectName =
    positional ??
    (yesMode
      ? "my-swift-rust-app"
      : await p.text({
          message: "What is your project named?",
          placeholder: "my-swift-rust-app",
          defaultValue: "my-swift-rust-app",
          validate: (v) => {
            if (!v) return "Project name is required";
            if (!isCurrentDir(v) && !isValidName(normalizeProjectName(v)))
              return 'Invalid name. Use letters, numbers, dashes, and underscores — or "." for the current directory.';
            return undefined;
          },
        }));

  if (!projectName || p.isCancel(projectName)) {
    p.cancel("Aborted.");
    return null;
  }

  // The scaffold is the full-demo template (TypeScript + src/ + Tailwind +
  // Biome). The only remaining choice is whether to install dependencies.
  const installAnswer: boolean | symbol =
    typeof flags.install === "boolean"
      ? flags.install
      : yesMode
        ? false
        : ((await p.confirm({
            message: "Would you like to install dependencies with `bun install`?",
            initialValue: true,
          })) ?? false);

  if (p.isCancel(installAnswer)) {
    p.cancel("Aborted.");
    return null;
  }

  return {
    projectName: normalizeProjectName(String(projectName)),
    language: "ts",
    renderer: "ssr-wasm",
    linter: "biome",
    tailwind: true,
    srcDir: true,
    importAlias: "@/*",
    useShadcn: false,
    install: installAnswer === true,
  };
}

async function runInstall(target: string): Promise<void> {
  const { spawn } = await import("node:child_process");
  await new Promise<void>((resolvePromise, reject) => {
    const child = spawn("bun", ["install"], { cwd: target, stdio: "inherit" });
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0 ? resolvePromise() : reject(new Error(`bun install exited with code ${code}`)),
    );
  });
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    console.log(HELP);
    process.exit(0);
  }

  const isTTY = process.stdout.isTTY === true;
  if (!isTTY && !args.includes("--yes") && !args.includes("-y")) {
    console.error("Non-interactive mode: pass --yes to skip prompts, or run in a terminal.");
    process.exit(1);
  }
  const quiet = !isTTY;

  const flags = parseFlags(args);
  const positional = flags._name as string | undefined;

  if (!quiet) p.intro(pc.bgCyan(pc.black(" create-swift-rust ")));

  const answers = await askQuestions(flags, positional);
  if (!answers) process.exit(1);

  const { projectName, install } = answers;
  const target = resolve(process.cwd(), projectName);

  if (projectName === ".") {
    if ((await listDir(target)).length > 0) {
      if (quiet) {
        console.error(`Target directory ${target} is not empty. Aborting.`);
        process.exit(1);
      }
      const proceed = await p.confirm({
        message: `Target directory ${pc.cyan(target)} is not empty. Continue?`,
        initialValue: false,
      });
      if (!proceed) {
        if (!quiet) p.cancel("Aborted.");
        process.exit(1);
      }
    }
  } else {
    if (await pathExists(target)) {
      if (quiet) {
        console.error(`Directory ${target} already exists. Aborting.`);
      } else {
        p.cancel(`Directory ${pc.red(target)} already exists.`);
      }
      process.exit(1);
    }
  }

  const summary = [
    `${pc.cyan("•")} Project:     ${pc.bold(projectName === "." ? resolve(target) : projectName)}`,
    `${pc.cyan("•")} Template:    Full demo (blog, dashboard, API, Image/PDF/Video/Font)`,
    `${pc.cyan("•")} Language:    TypeScript`,
    `${pc.cyan("•")} Styling:     Tailwind CSS`,
    `${pc.cyan("•")} Linter:      Biome`,
    `${pc.cyan("•")} Install:     ${install ? "Yes" : "No"}`,
  ].join("\n");

  if (quiet) {
    console.log(`Configuration:\n${summary}`);
  } else {
    p.log.step(`Configuration:\n${summary}`);
    const confirm = await p.confirm({
      message: "Looks good?",
      initialValue: true,
    });
    if (p.isCancel(confirm) || !confirm) {
      p.cancel("Aborted.");
      process.exit(1);
    }
  }

  console.log(`Scaffolding ${pc.cyan(projectName === "." ? "." : projectName)}…`);

  try {
    await copyTemplate(target, projectName);
    console.log(`✓ Scaffolded project into ${pc.green(target)}`);

    if (install) {
      console.log("Running bun install…");
      try {
        await runInstall(target);
        console.log("✓ Installed dependencies");
      } catch (_err) {
        console.error("Failed to install dependencies. Run `bun install` manually.");
      }
    }

    const next = projectName === "." ? "bun run dev" : `cd ${projectName}\nbun run dev`;
    console.log(`\n${pc.green("Done!")} Next steps:\n${pc.cyan(next)}`);
  } catch (err) {
    console.error("Scaffolding failed:", (err as Error).message);
    process.exit(1);
  }
}

async function listDir(dir: string): Promise<string[]> {
  try {
    const { readdir } = await import("node:fs/promises");
    return await readdir(dir);
  } catch {
    return [];
  }
}

if (import.meta.main) {
  main().catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  });
}
