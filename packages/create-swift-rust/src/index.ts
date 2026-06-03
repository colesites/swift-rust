#!/usr/bin/env node
import { existsSync } from "node:fs";
import { mkdir, stat, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import * as p from "@clack/prompts";
import pc from "picocolors";

type Language = "ts" | "js";
type Linter = "biome" | "eslint";
type Renderer = "ssr" | "ssr-wasm" | "ssr-htmx" | "wasm";
type AskAnswer<T> = T | string | symbol;

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

function isValidAlias(alias: string): boolean {
  return /^[a-zA-Z@][a-zA-Z0-9_/*-]*$/.test(alias);
}

const HELP = `
${pc.bold("create-swift-rust")} - scaffold a new swift-rust project

${pc.bold("Usage")}
  ${pc.cyan("bun create swift-rust@latest")} [project-name] [options]

${pc.bold("Options")}
  ${pc.yellow("--ts, --typescript")}      Use TypeScript (default)
  ${pc.yellow("--js, --javascript")}      Use JavaScript
  ${pc.yellow("--tailwind")}              Install Tailwind CSS
  ${pc.yellow("--no-tailwind")}           Skip Tailwind CSS
  ${pc.yellow("--shadcn")}                Install shadcn-style UI components (default)
  ${pc.yellow("--no-shadcn")}             Skip shadcn UI components
  ${pc.yellow("--src-dir")}               Use src/ under app/ (default)
  ${pc.yellow("--no-src-dir")}            Use top-level app/
  ${pc.yellow("--biome")}                 Use Biome for linting (default)
  ${pc.yellow("--eslint")}                Use ESLint for linting
  ${pc.yellow("--import-alias <prefix>")} Set import alias (default "@/*")
  ${pc.yellow("--ssr")}                   Server-side rendering
  ${pc.yellow("--ssr-wasm")}              SSR with WASM hydration (default)
  ${pc.yellow("--ssr-htmx")}              SSR with HTMX
  ${pc.yellow("--wasm")}                  Full WASM SPA
  ${pc.yellow("--install")}               Run bun install after scaffolding
  ${pc.yellow("--no-install")}            Skip bun install (default)
  ${pc.yellow("--yes, -y")}               Skip prompts, use defaults
  ${pc.yellow("--help, -h")}              Show this help

${pc.bold("Examples")}
  ${pc.cyan("bun create swift-rust@latest")}
  ${pc.cyan("bun create swift-rust@latest my-app --ts --tailwind --src-dir")}
  ${pc.cyan("bun create swift-rust@latest ./ --tailwind --eslint")}
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

const RENDERER_OPTIONS: Array<{ value: Renderer; label: string; hint: string }> = [
  {
    value: "ssr-wasm",
    label: "SSR + WASM hydration",
    hint: "Default. Server-rendered HTML, WASM-hydrated interactive islands.",
  },
  { value: "ssr", label: "SSR only", hint: "Server-rendered HTML, no client JavaScript at all." },
  {
    value: "ssr-htmx",
    label: "SSR + HTMX",
    hint: "Progressive enhancement with HTMX-style interactions.",
  },
  {
    value: "wasm",
    label: "Full WASM SPA",
    hint: "Single-page app compiled entirely to WebAssembly.",
  },
];

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
            if (!isValidName(v))
              return "Invalid name. Use letters, numbers, dashes, and underscores.";
            return undefined;
          },
        }));

  if (!projectName || p.isCancel(projectName)) {
    p.cancel("Aborted.");
    return null;
  }

  let languageAnswer: AskAnswer<Language>;
  if (flags.language) {
    languageAnswer = flags.language as string;
  } else if (yesMode) {
    languageAnswer = "ts";
  } else {
    const languageOptions: Array<{ value: Language; label: string; hint: string }> = [
      { value: "ts", label: "TypeScript", hint: "Type-safe, recommended" },
      { value: "js", label: "JavaScript", hint: "No type checking" },
    ];
    const result = await p.select({
      message: "Which language would you like to use?",
      options: languageOptions,
      initialValue: "ts" as Language,
    });
    languageAnswer = result as unknown as AskAnswer<Language>;
  }

  if (p.isCancel(languageAnswer)) {
    p.cancel("Aborted.");
    return null;
  }
  const language: Language = languageAnswer as Language;

  let renderer: Renderer = (flags.renderer as Renderer | undefined) ?? "ssr-wasm";
  if (!flags.renderer && !yesMode) {
    const r = (await p.select({
      message: "Which rendering mode do you want?",
      options: RENDERER_OPTIONS,
      initialValue: "ssr-wasm",
    })) as unknown as Renderer | symbol as Renderer | symbol;
    if (p.isCancel(r)) {
      p.cancel("Aborted.");
      return null;
    }
    renderer = r as Renderer;
  }

  let linterAnswer: AskAnswer<Linter>;
  if (flags.linter) {
    linterAnswer = flags.linter as string;
  } else if (yesMode) {
    linterAnswer = "biome";
  } else {
    const linterOptions: Array<{ value: Linter; label: string; hint: string }> = [
      { value: "biome", label: "Biome", hint: "Fast Rust-based all-in-one tool (recommended)" },
      { value: "eslint", label: "ESLint", hint: "The classic, more configurable" },
    ];
    const result = await p.select({
      message: "Which linter would you like to use?",
      options: linterOptions,
      initialValue: "biome" as Linter,
    });
    linterAnswer = result as unknown as AskAnswer<Linter>;
  }

  if (p.isCancel(linterAnswer)) {
    p.cancel("Aborted.");
    return null;
  }
  const linter: Linter = linterAnswer as Linter;

  const tailwindAnswer: boolean | symbol =
    typeof flags.tailwind === "boolean"
      ? flags.tailwind
      : yesMode
        ? false
        : ((await p.confirm({
            message: "Would you like to use Tailwind CSS?",
            initialValue: true,
          })) ?? false);

  if (p.isCancel(tailwindAnswer)) {
    p.cancel("Aborted.");
    return null;
  }

  const tailwind: boolean = tailwindAnswer === true;

  const useShadcnAnswer: boolean | symbol =
    typeof flags.useShadcn === "boolean"
      ? flags.useShadcn
      : yesMode
        ? true
        : ((await p.confirm({
            message: "Would you like to use shadcn-style UI components?",
            initialValue: true,
          })) ?? false);

  if (p.isCancel(useShadcnAnswer)) {
    p.cancel("Aborted.");
    return null;
  }

  const useShadcn: boolean = useShadcnAnswer === true;

  const srcDirAnswer: boolean | symbol =
    typeof flags.srcDir === "boolean"
      ? flags.srcDir
      : yesMode
        ? true
        : ((await p.confirm({
            message: "Would you like to use a `src/` directory for your app code?",
            initialValue: true,
          })) ?? true);

  if (p.isCancel(srcDirAnswer)) {
    p.cancel("Aborted.");
    return null;
  }

  const srcDir: boolean = srcDirAnswer === true;

  const importAliasAnswer: string | symbol =
    (flags.importAlias as string | undefined) ??
    (yesMode
      ? "@/*"
      : ((await p.text({
          message: "Would you like to customize the import alias?",
          placeholder: "@/*",
          defaultValue: "@/*",
          validate: (v) => {
            if (!v) return "Import alias is required";
            if (!isValidAlias(v)) return "Invalid alias. Use letters, numbers, @, /, *, -, _.";
            return undefined;
          },
        })) as string));

  if (p.isCancel(importAliasAnswer)) {
    p.cancel("Aborted.");
    return null;
  }
  const importAlias: string = importAliasAnswer as string;
  if (!importAlias) {
    p.cancel("Aborted.");
    return null;
  }

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

  const install: boolean = installAnswer === true;

  return {
    projectName,
    language,
    renderer,
    linter,
    tailwind,
    srcDir,
    importAlias,
    useShadcn,
    install,
  };
}

async function writeProjectFiles(target: string, answers: Answers): Promise<void> {
  const { projectName, language, renderer, linter, tailwind, srcDir, importAlias, useShadcn } =
    answers;
  const appDir = join(target, srcDir ? "app/src" : "app");
  const componentsDir = join(target, "components");
  const libDir = join(target, "lib");
  const uiDir = join(componentsDir, "ui");

  await mkdir(target, { recursive: true });
  await mkdir(appDir, { recursive: true });
  await mkdir(componentsDir, { recursive: true });
  await mkdir(libDir, { recursive: true });
  await mkdir(join(target, "public"), { recursive: true });
  if (useShadcn) {
    await mkdir(uiDir, { recursive: true });
  }

  const fileExt = (lang: Language) => (lang === "ts" ? "ts" : "js");
  const componentExt = (lang: Language) => (lang === "ts" ? "tsx" : "jsx");

  const pkg: Record<string, unknown> = {
    name: projectName,
    version: "0.1.0",
    private: true,
    type: "module",
    scripts: {
      dev: "swift-rust dev",
      build: "swift-rust build",
      start: "swift-rust start",
      lint: linter === "biome" ? "biome check ." : "eslint .",
      test: "bun test",
      ...(language === "ts" ? { typecheck: "tsc --noEmit" } : {}),
      format: linter === "biome" ? "biome format --write ." : "prettier --write .",
    },
    dependencies: {
      "swift-rust": "^0.2.0",
      react: "^19.0.0",
      "react-dom": "^19.0.0",
      ...(useShadcn
        ? {
            clsx: "^2.1.1",
            "tailwind-merge": "^2.5.5",
            "class-variance-authority": "^0.7.1",
            "lucide-react": "^0.460.0",
            "tw-animate-css": "^1.0.0",
          }
        : {}),
    },
    devDependencies: {
      ...(language === "ts"
        ? { typescript: "^5.6.0", "@types/react": "^19.0.0", "@types/react-dom": "^19.0.0" }
        : {}),
      ...(linter === "biome" ? { "@biomejs/biome": "^1.9.0" } : { eslint: "^9.0.0" }),
      ...(tailwind
        ? { tailwindcss: "^4.0.0", "@tailwindcss/postcss": "^4.0.0", postcss: "^8.4.0" }
        : {}),
      ...(useShadcn ? { shadcn: "^2.0.0" } : {}),
    },
  };
  await writeFile(join(target, "package.json"), `${JSON.stringify(pkg, null, 2)}\n`);

  const config = {
    rendering: renderer,
    image: { domains: [], formats: ["image/avif", "image/webp"] },
    font: { subsets: ["latin"], display: "swap" },
    pdf: { defaultPageSize: "A4" },
  };
  await writeFile(join(target, "swift-rust.config.json"), `${JSON.stringify(config, null, 2)}\n`);

  if (language === "ts") {
    const tsconfig = {
      extends: "swift-rust/tsconfig.base.json",
      compilerOptions: {
        jsx: "preserve",
        baseUrl: ".",
        paths: { [importAlias]: ["./*"] },
      },
      include: [
        srcDir ? "app/src/**/*" : "app/**/*",
        "components/**/*",
        "lib/**/*",
        "globals.d.ts",
        ".swift-rust/types/**/*",
      ],
      exclude: ["node_modules", "dist", ".swift-rust", ".turbo"],
    };
    await writeFile(join(target, "tsconfig.json"), `${JSON.stringify(tsconfig, null, 2)}\n`);
  } else {
    const jsconfig = {
      compilerOptions: {
        baseUrl: ".",
        paths: { [importAlias]: ["./*"] },
      },
      include: [srcDir ? "app/src/**/*" : "app/**/*", "components/**/*", "lib/**/*"],
    };
    await writeFile(join(target, "jsconfig.json"), `${JSON.stringify(jsconfig, null, 2)}\n`);
  }

  const gitignore = [
    "node_modules/",
    ".swift-rust/",
    ".vercel/",
    "dist/",
    ".turbo/",
    ".env*.local",
    "target/",
    "*.log",
    ".DS_Store",
  ].join("\n");
  await writeFile(join(target, ".gitignore"), `${gitignore}\n`);

  const vercelConfig = {
    $schema: "https://openapi.vercel.sh/vercel.json",
    buildCommand: "bun run build",
    installCommand: "bun install --frozen-lockfile",
    outputDirectory: ".vercel/output",
    framework: null,
    trailingSlash: false,
    cleanUrls: true,
    headers: [
      {
        source: "/_swift-rust/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/fonts/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ],
  };
  await writeFile(join(target, "vercel.json"), `${JSON.stringify(vercelConfig, null, 2)}\n`);

  if (tailwind) {
    const postcss = `const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
`;
    await writeFile(join(target, "postcss.config.mjs"), postcss);

    const shadcnVars = useShadcn
      ? `

/* shadcn design tokens (https://ui.shadcn.com/docs/theming) */
:root {
  --ui-bg: #ffffff;
  --ui-fg: #09090b;
  --ui-card: #ffffff;
  --ui-card-fg: #09090b;
  --ui-popover: #ffffff;
  --ui-popover-fg: #09090b;
  --ui-primary: #18181b;
  --ui-primary-fg: #fafafa;
  --ui-secondary: #f4f4f5;
  --ui-secondary-fg: #18181b;
  --ui-muted: #f4f4f5;
  --ui-muted-fg: #71717a;
  --ui-accent: #f4f4f5;
  --ui-accent-fg: #18181b;
  --ui-destructive: #ef4444;
  --ui-destructive-fg: #fafafa;
  --ui-border: #e4e4e7;
  --ui-input: #e4e4e7;
  --ui-ring: #18181b;
  --ui-radius: 0.5rem;
}

.dark {
  --ui-bg: #09090b;
  --ui-fg: #fafafa;
  --ui-card: #09090b;
  --ui-card-fg: #fafafa;
  --ui-popover: #09090b;
  --ui-popover-fg: #fafafa;
  --ui-primary: #fafafa;
  --ui-primary-fg: #18181b;
  --ui-secondary: #27272a;
  --ui-secondary-fg: #fafafa;
  --ui-muted: #27272a;
  --ui-muted-fg: #a1a1aa;
  --ui-accent: #27272a;
  --ui-accent-fg: #fafafa;
  --ui-destructive: #7f1d1d;
  --ui-destructive-fg: #fafafa;
  --ui-border: #27272a;
  --ui-input: #27272a;
  --ui-ring: #d4d4d8;
}

@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    --ui-bg: #09090b;
    --ui-fg: #fafafa;
    --ui-card: #09090b;
    --ui-card-fg: #fafafa;
    --ui-popover: #09090b;
    --ui-popover-fg: #fafafa;
    --ui-primary: #fafafa;
    --ui-primary-fg: #18181b;
    --ui-secondary: #27272a;
    --ui-secondary-fg: #fafafa;
    --ui-muted: #27272a;
    --ui-muted-fg: #a1a1aa;
    --ui-accent: #27272a;
    --ui-accent-fg: #fafafa;
    --ui-destructive: #7f1d1d;
    --ui-destructive-fg: #fafafa;
    --ui-border: #27272a;
    --ui-input: #27272a;
    --ui-ring: #d4d4d8;
  }
}

@theme inline {
  --color-background: var(--ui-bg);
  --color-foreground: var(--ui-fg);
  --color-card: var(--ui-card);
  --color-card-foreground: var(--ui-card-fg);
  --color-popover: var(--ui-popover);
  --color-popover-foreground: var(--ui-popover-fg);
  --color-primary: var(--ui-primary);
  --color-primary-foreground: var(--ui-primary-fg);
  --color-secondary: var(--ui-secondary);
  --color-secondary-foreground: var(--ui-secondary-fg);
  --color-muted: var(--ui-muted);
  --color-muted-foreground: var(--ui-muted-fg);
  --color-accent: var(--ui-accent);
  --color-accent-foreground: var(--ui-accent-fg);
  --color-destructive: var(--ui-destructive);
  --color-destructive-foreground: var(--ui-destructive-fg);
  --color-border: var(--ui-border);
  --color-input: var(--ui-input);
  --color-ring: var(--ui-ring);
  --radius: var(--ui-radius);
}
`
      : "";

    const css = `@import "tailwindcss";
${useShadcn ? '@import "tw-animate-css";' : ""}

@theme {
  --color-bg: #ffffff;
  --color-fg: #09090b;
  --color-accent: ${useShadcn ? "#f97316" : "#0070f3"};
  --font-sans: var(--font-geist-sans), system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
}

@variant dark (&:where(.dark, .dark *));

@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    --color-bg: #09090b;
    --color-fg: #fafafa;
  }
}

body {
  background: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-sans);
}
${shadcnVars}`;
    await writeFile(
      join(appDir, `globals.${fileExt(language)}`),
      language === "ts" ? `import "./globals.css";\n` : `import "./globals.css";\n`,
    );
    await writeFile(join(appDir, "globals.css"), css);
  }

  const layoutImports = `import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "swift-rust/font/google";
${tailwind ? `import "./globals.css";\n` : ""}
const geistSans = Geist({ subsets: ["latin"], display: "swap", variable: true });
const geistMono = Geist_Mono({ subsets: ["latin"], display: "swap", variable: true });

export const metadata = {
  title: {
    template: "%s | ${projectName}",
    default: "${projectName}",
  },
  description: "Built with swift-rust — the React framework powered with Rust + Bun. 10x faster than Next.js.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={\`\${geistSans.variable} \${geistMono.variable} h-full antialiased\`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="${tailwind ? "min-h-full flex flex-col" : ""}">${tailwind ? "{children}" : "\\n        {children}\\n      "}</body>
    </html>
  );
}
`;
  await writeFile(join(appDir, `layout.${componentExt(language)}`), layoutImports);

  const homePage = tailwind
    ? useShadcn
      ? `import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <Badge variant="secondary" className="w-fit mb-2">Welcome</Badge>
          <CardTitle className="text-3xl sm:text-5xl">${projectName}</CardTitle>
          <CardDescription>
            Get started by editing <code>${srcDir ? "app/src/" : "app/"}page.${componentExt(language)}</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <a
            href="https://swift-rust.dev/docs"
            className={buttonVariants({ variant: "default" })}
          >
            Read the docs →
          </a>
          <a
            href="https://github.com/swift-rust/swift-rust"
            className={buttonVariants({ variant: "outline" })}
          >
            GitHub
          </a>
        </CardContent>
      </Card>
    </main>
  );
}
`
      : `export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <div className="inline-block mb-4 px-3 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent">
          Welcome
        </div>
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
          ${projectName}
        </h1>
        <p className="text-lg text-fg-secondary mb-8">
          Get started by editing <code>${srcDir ? "app/src/" : "app/"}page.${componentExt(language)}</code>.
        </p>
        <a
          href="https://swift-rust.dev/docs"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-fg text-bg font-medium text-sm hover:opacity-90 transition-opacity"
        >
          Read the docs →
        </a>
      </div>
    </main>
  );
}
`
    : `export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ maxWidth: "32rem", textAlign: "center" }}>
        <h1>${projectName}</h1>
        <p>Get started by editing <code>${srcDir ? "app/src/" : "app/"}page.${componentExt(language)}</code>.</p>
        <a href="https://swift-rust.dev/docs">Read the docs →</a>
      </div>
    </main>
  );
}
`;
  await writeFile(join(appDir, `page.${componentExt(language)}`), homePage);

  const notFoundPage = tailwind
    ? `export const metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-fg-secondary">Page not found</p>
        <a href="/" className="text-accent mt-6 inline-block">← Go home</a>
      </div>
    </main>
  );
}
`
    : `export default function NotFound() {
  return (
    <main>
      <h1>404</h1>
      <p>Page not found</p>
      <a href="/">← Go home</a>
    </main>
  );
}
`;
  await writeFile(join(appDir, `not-found.${componentExt(language)}`), notFoundPage);

  if (linter === "biome") {
    const biome = {
      $schema: "https://biomejs.dev/schemas/1.9.0/schema.json",
      vcs: { enabled: true, clientKind: "git", useIgnoreFile: true },
      files: { ignore: [".swift-rust", "node_modules", "dist", ".turbo"] },
      formatter: { enabled: true, indentStyle: "space", indentWidth: 2 },
      organizeImports: { enabled: true },
      linter: {
        enabled: true,
        rules: { recommended: true, a11y: { noSvgWithoutTitle: "off" } },
      },
      javascript: { formatter: { quoteStyle: "double", semicolons: "always" } },
    };
    await writeFile(join(target, "biome.json"), `${JSON.stringify(biome, null, 2)}\n`);
  } else {
    const eslint = `import swiftRust from "eslint-config-swift-rust";

export default [
  ...swiftRust,
  {
    ignores: [".swift-rust/**", "node_modules/**", "dist/**", ".turbo/**"],
  },
];
`;
    await writeFile(join(target, "eslint.config.mjs"), eslint);
  }

  const readme = `# ${projectName}

Built with [swift-rust](https://swift-rust.dev) — the React framework powered with Rust + Bun. 10x faster than Next.js.

## Scripts

- \`bun run dev\` — start the dev server
- \`bun run build\` — build for production
- \`bun run start\` — start the production server
- \`bun run lint\` — run the linter
- \`bun run typecheck\` — run TypeScript checks (if TS)
- \`bun run test\` — run tests
- \`bun run format\` — format the code

## Project structure

 ${
   srcDir
     ? `\`\`\`\napp/\n  src/\n    layout.${componentExt(language)}\n    page.${componentExt(language)}\n    not-found.${componentExt(language)}\ncomponents/\nlib/\n\`\`\``
     : `\`\`\`\napp/\n  layout.${componentExt(language)}\n  page.${componentExt(language)}\n  not-found.${componentExt(language)}\ncomponents/\nlib/\n\`\`\``
 }

## Learn more

- [Documentation](https://swift-rust.dev/docs)
- [Examples](https://github.com/swift-rust/swift-rust/tree/main/examples)
- [Discord](https://discord.gg/swift-rust)

## Deploy to Vercel

The fastest way to deploy is to push to GitHub and import the repo on Vercel:

\`\`\`bash
git init && git add -A && git commit -m "init"
git remote add origin https://github.com/you/${projectName}.git
git push -u origin main
\`\`\`

Then on [vercel.com/new](https://vercel.com/new), import the repo. No configuration needed — \`vercel.json\` is included. Your site will be live at \`https://${projectName}.vercel.app\`.

For custom domains and ISR / serverless functions, see the [deploy guide](https://swift-rust.dev/docs/guides/deploying).
`;
  await writeFile(join(target, "README.md"), readme);

  const envExample = `# Rename to .env.local to use
# SWIFT_RUST_RUNTIME=/path/to/bun
`;
  await writeFile(join(target, ".env.example"), envExample);

  const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#0070f3"/><path d="M8 8L16 24L24 8" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="16" cy="16" r="2.5" fill="white"/></svg>
`;
  await writeFile(join(target, "public", "favicon.svg"), favicon);

  // 32x32 favicon.ico (PNG-encoded) matching favicon.svg, so browsers that
  // request /favicon.ico get a real icon instead of a 404.
  const faviconIco =
    "AAABAAEAICAAAAEAIAAJAwAAFgAAAIlQTkcNChoKAAAADUlIRFIAAAAgAAAAIAgGAAAAc3p69AAAAAZiS0dEAP8A/wD/oL2nkwAAAr5JREFUWIXFl8FPE0EUxn8zU40GS5cDGg8kJlIkARNDevBPIKEHDkob0AuHnkA5eEISa/QoCUlPNfFmoyTEmIgJ+g80HKzcEJQD9IZEoBUxpdv1sHQt4MLOAvU7bfbNzPd9b97M7hPU4kHxImXuAT0gwmA1cCIQW1jWIpL3KFI8C646EWfM/eJtBC+A4MmQuqIIDDIRnPorwCaf3CPodGEBfUwEp8Ru2r9x+s73o4BJq9zd83qTAzSiGJZA9D+Q27CISuCqW7zFELQY/sviyPmCVglccJu8MNrAwmgDbc1Sm7ytWTrzDxERDLhFpICzCpSER1feMvBwQEvAo0yG82f6MSv2Wq48boHldYvJuTIAsViM9vZ2z+ThcJhYLAbA689lltctfQEAyZkSZgWUUoyNjXkWkEwmUUphVuDpx9KhYw8V8PV7xclCPB73lIX97r+sVvwLAP0s6Lj3JMAtC4ZhkEgkSCQShEIhQN+9JwFwMAuGYZDL5Uin06TTaXK5HKFQSNs9gOLmaPKoQT9+WVy7JLl+WdLR0UGpVKK3t9eJNzU1sbW1xdDQEFJKXuXKPM/ueBLg+YapzUJ3d/eBeDQa1XavJaC2FiKRCPl83omtrKwQiUQA73uvLQD2ZiGbzTpFODs768s9gGCk6H5N/QOZu+fo7wpgmiadnZ2Ypsn8/DxKKTKfytx5+VtLgOu3wA3JmRKxGwHnRAghfLv3JaBaC/1dAeLxuPN+ck5v76vQ/86ytxaq7p980HfvW0DtiQD/7n0LAHg8U2J7B7Z37Ge/EIwUC/j8Ka3+6eQ3tA5SLQoSWPI7O79hHYccLJYkgmn/KxwTkncSRQq7Xao3NpFWSu42ioPY7VK9YAGDjDeu2afAbhT7gEIdyDeBW0wE38D+ZnS42IxiGOgB2nDpGXzgJ7CIYBpppRhvXKsG/gDYRSdUVzOcWwAAAABJRU5ErkJggg==";
  await writeFile(join(target, "public", "favicon.ico"), Buffer.from(faviconIco, "base64"));

  if (useShadcn) {
    await scaffoldShadcn({ target, uiDir, libDir, componentExt: componentExt(language), srcDir });
  }
}

async function scaffoldShadcn(options: {
  target: string;
  uiDir: string;
  libDir: string;
  componentExt: string;
  srcDir: boolean;
}): Promise<void> {
  const { target, uiDir, libDir, componentExt, srcDir } = options;

  const utilsContent = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

  const buttonContent = `import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[var(--ui-primary)] text-[var(--ui-primary-fg)] hover:opacity-90",
        destructive: "bg-[var(--ui-destructive)] text-white hover:opacity-90",
        outline:
          "border border-[var(--ui-border)] bg-[var(--ui-bg)] hover:bg-[var(--ui-accent)] hover:text-[var(--ui-accent-fg)]",
        secondary: "bg-[var(--ui-secondary)] text-[var(--ui-secondary-fg)] hover:opacity-90",
        ghost: "hover:bg-[var(--ui-accent)] hover:text-[var(--ui-accent-fg)]",
        link: "text-[var(--ui-primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  ),
);
Button.displayName = "Button";

export { buttonVariants };
`;

  const cardContent = `import * as React from "react";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-[var(--ui-border)] bg-[var(--ui-card)] text-[var(--ui-card-fg)] shadow-sm",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-[var(--ui-muted-fg)]", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  ),
);
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";
`;

  const inputContent = `import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-9 w-full rounded-md border border-[var(--ui-border)] bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--ui-fg)]",
        "placeholder:text-[var(--ui-muted-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-ring)] focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
`;

  const labelContent = `import * as React from "react";
import { cn } from "@/lib/utils";

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    )}
    {...props}
  />
));
Label.displayName = "Label";
`;

  const badgeContent = `import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ui-ring)] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--ui-primary)] text-[var(--ui-primary-fg)] hover:opacity-90",
        secondary:
          "border-transparent bg-[var(--ui-secondary)] text-[var(--ui-secondary-fg)] hover:opacity-90",
        destructive:
          "border-transparent bg-[var(--ui-destructive)] text-white hover:opacity-90",
        outline: "text-[var(--ui-fg)] border-[var(--ui-border)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
`;

  const componentsJson = `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": ${componentExt === "tsx"},
  "tailwind": {
    "config": "",
    "css": "${srcDir ? "app/src/globals.css" : "app/globals.css"}",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
`;

  await writeFile(join(libDir, "utils.ts"), utilsContent);
  await writeFile(join(uiDir, `button.${componentExt}`), buttonContent);
  await writeFile(join(uiDir, `card.${componentExt}`), cardContent);
  await writeFile(join(uiDir, `input.${componentExt}`), inputContent);
  await writeFile(join(uiDir, `label.${componentExt}`), labelContent);
  await writeFile(join(uiDir, `badge.${componentExt}`), badgeContent);
  await writeFile(join(target, "components.json"), `${componentsJson}\n`);
}

async function runInstall(target: string): Promise<void> {
  const { spawn } = await import("node:child_process");
  return new Promise((resolve, reject) => {
    const proc = spawn("bun", ["install"], { cwd: target, stdio: "inherit" });
    proc.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`bun install exited with code ${code}`));
    });
    proc.on("error", reject);
  });
}

const SHADCN_DEFAULT_COMPONENTS = ["button", "card", "input", "label", "badge"] as const;

async function runShadcnAdd(target: string, components: readonly string[]): Promise<boolean> {
  const { spawn } = await import("node:child_process");
  return new Promise((resolve) => {
    const args = [
      "--bun",
      "shadcn@latest",
      "add",
      ...components,
      "--yes",
      "--overwrite",
      "--cwd",
      target,
      "--silent",
    ];
    const proc = spawn("bunx", args, { cwd: target, stdio: "pipe" });
    proc.on("exit", (code) => {
      resolve(code === 0);
    });
    proc.on("error", () => resolve(false));
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

  const { projectName, tailwind, linter, srcDir, install } = answers;
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
    `${pc.cyan("•")} Language:    ${answers.language === "ts" ? "TypeScript" : "JavaScript"}`,
    `${pc.cyan("•")} Renderer:    ${answers.renderer}`,
    `${pc.cyan("•")} Linter:      ${linter === "biome" ? "Biome" : "ESLint"}`,
    `${pc.cyan("•")} Tailwind:    ${tailwind ? "Yes" : "No"}`,
    `${pc.cyan("•")} shadcn UI:   ${answers.useShadcn ? "Yes" : "No"}`,
    `${pc.cyan("•")} src/ dir:    ${srcDir ? "Yes (app/src/)" : "No"}`,
    `${pc.cyan("•")} Import as:   ${answers.importAlias}`,
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
    await writeProjectFiles(target, answers);
    console.log(`✓ Scaffolded project into ${pc.green(target)}`);

    let installSucceeded = false;
    if (install) {
      console.log("Running bun install…");
      try {
        await runInstall(target);
        console.log("✓ Installed dependencies");
        installSucceeded = true;
      } catch (_err) {
        console.error("Failed to install dependencies. Run `bun install` manually.");
      }
    }

    if (answers.useShadcn && installSucceeded) {
      console.log("Fetching canonical shadcn components…");
      const ok = await runShadcnAdd(target, SHADCN_DEFAULT_COMPONENTS);
      if (ok) {
        console.log(
          `✓ Added ${SHADCN_DEFAULT_COMPONENTS.length} shadcn components from the registry`,
        );
      } else {
        const cwdArg = projectName === "." ? "." : `./${projectName}`;
        console.log(
          `${pc.yellow("!")} Could not fetch shadcn components from the registry. Using bundled shadcn-style components as a fallback. You can retry later with: ${pc.cyan(`bunx --bun shadcn@latest add ${SHADCN_DEFAULT_COMPONENTS.join(" ")} --cwd ${cwdArg}`)}`,
        );
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
