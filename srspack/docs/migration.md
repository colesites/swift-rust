---
title: Migration
---

# Migration

Migrating from a webpack- or Rspack-based project to srspack is a configuration change, not a code change. srspack reads the same `import` syntax, the same JSX, the same CSS Modules conventions, and the same `import "foo"` resolution rules.

## What changes

| webpack / Rspack | srspack |
|---|---|
| `webpack.config.js` | `srspack.config.ts` |
| `rspack.config.js` | `srspack.config.ts` |
| `module.rules: [{ test: /\.tsx?$/, use: 'builtin:swc-loader' }]` | `loaders: [{ test: /\.tsx?$/, use: 'tsx' }]` |
| `optimization.minimize: true` | `minify: true` |
| `output.path: 'dist'` | `outDir: 'dist'` |
| `mode: 'production'` | `mode: 'production'` |
| `entry: { main: './src/main.ts' }` | auto-discovered from `app/` |
| `externals: ['react']` | `externals: ['react']` |
| `plugins: [new HtmlPlugin()]` | none (HTML emitted by framework) |
| `devServer: { port: 3000 }` | `swift-rust dev --port 3000` |

## What does not change

- File layout: `app/page.tsx`, `app/layout.tsx`, `app/global.css` are the same.
- Import syntax: `import { foo } from "./bar"` works.
- CSS Modules: `import styles from "./x.module.css"` works.
- TypeScript: `tsconfig.json` is read by the Swift-Rust compiler, not by srspack. Same file, same content.
- Source maps: `sourcemap: true` produces the same `*.map` files.

## What is gone

- **JS plugins.** srspack has no JS plugin API. If your project relies on webpack plugins, the migration is a rewrite of those plugins as Rust crates or as framework features.
- **HtmlWebpackPlugin.** srspack does not emit HTML. The Swift-Rust framework generates HTML at the route level.
- **Custom resolvers.** srspack uses Node-style resolution (`node_modules/...`) and the Swift-Rust convention (`swift-rust/...`). Other resolvers are not supported.

## Step-by-step

1. `rm -f webpack.config.js rspack.config.js`
2. `touch srspack.config.ts`
3. Translate the config field-by-field using the table above.
4. Move any custom webpack plugins into `app/` (if framework-level) or `crates/` (if bundler-level).
5. `bunx swift-rust build` and compare the `dist/` output to the old build.

The `dist/` directory layout differs (srspack uses content hashes, not deterministic names), but the *content* is the same JavaScript.
