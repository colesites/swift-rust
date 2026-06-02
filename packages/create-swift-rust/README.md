# create-swift-rust

Scaffold a new swift-rust project.

## Usage

```bash
bunx create-swift-rust@latest my-app
# or
bun create swift-rust my-app
# or
npm create swift-rust@latest my-app
```

The CLI prompts for:

1. **Project name** — directory to create.
2. **Rendering mode** — `ssr`, `ssr-wasm`, `ssr-htmx`, or `wasm`.

Pass `--yes` to skip the prompts and use the defaults.

## What it generates

```
my-app/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── package.json
├── tsconfig.json
├── swift-rust.config.json
└── .gitignore
```
