---
title: Configuration
---

# Configuration

srspack is configured by a `srspack.config.ts` file at the project root. The config is a typed object; IDEs provide autocomplete, and the type definitions live in `lib/src/native.d.ts`.

## Full reference

```ts
import { defineSrspackConfig } from "@swift-rust/srspack/plugin";

export default defineSrspackConfig({
  mode: "production",
  outDir: "dist",
  sourcemap: true,
  minify: true,
  target: {
    bun: ">=1.3.0",
    browsers: ["last 2 versions"],
  },
  externals: ["react", "react-dom"],
  loaders: [
    { test: /\.tsx?$/, use: "tsx" },
    { test: /\.module\.css$/, use: "css" },
    { test: /\.css$/, use: "css" },
  ],
  plugins: [],
});
```

## Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `mode` | `"development" \| "production"` | `"development"` | Controls sourcemap defaults, dev-time warnings, and minification. |
| `outDir` | `string` | `"dist"` | Where to write the bundle. Relative to the project root. |
| `sourcemap` | `boolean` | `true` | Emit `*.map` files alongside each output. |
| `minify` | `boolean` | `mode === "production"` | Run the minifier on JS and CSS output. |
| `target` | `Target` | `{ bun: ">=1.3.0" }` | Compatibility targets. See below. |
| `externals` | `string[]` | `[]` | Module specifiers that should not be bundled (left as runtime imports). |
| `loaders` | `LoaderRule[]` | auto | Loaders to apply. If omitted, the built-in `tsx` and `css` loaders are used. |
| `plugins` | `SrspackPlugin[]` | `[]` | Plugins to apply. See `lib/src/native.d.ts`. |

## `target`

The `target` field declares which runtimes the bundle must be compatible with. srspack uses this to decide which ES features to preserve, whether to emit ESM or CJS, and whether to polyfill `fetch`.

```ts
target: {
  bun: ">=1.3.0",
  node: ">=20",
  deno: ">=2.0",
  browsers: ["last 2 versions", "not dead"],
}
```

At least one target is required. If `target.bun` is set, the bundle is assumed to run on Bun and ESM is the default output format.

## `loaders`

A `LoaderRule` is `{ test, use, enforce? }`. `test` is a regex (or a string, which is treated as a regex) matched against the file path. `use` is the name of a registered loader. The built-in loaders are `tsx` (`.tsx`, `.jsx`) and `css` (`.css`, `.module.css`, `.scss`).

```ts
loaders: [
  { test: /\.tsx?$/, use: "tsx" },
  { test: /\.module\.css$/, use: "css" },
  { test: /\.svg$/, use: "asset" },
]
```

## `plugins`

A `SrspackPlugin` is a JS module that exports `{ name, apply }`. It receives a `SrspackPluginApi` with the resolved options and a `hooks` object for registering callbacks. Plugins are JS, but they run in the same process as the bundler; there is no IPC.

```ts
const myPlugin = {
  name: "my-plugin",
  apply(api) {
    api.hooks.onTransform((file, code) => {
      if (file.endsWith(".env")) {
        return injectEnv(code, process.env);
      }
      return code;
    });
  },
};
```

## Loading the config

The Swift-Rust CLI calls `loadConfig()` from `lib/src/plugin.ts`. It searches for `srspack.config.{ts,js,json}` in the project root. If none is found, the default config is used.

## Config validation

The config is validated against the TypeScript types at load time. Invalid values produce a structured error pointing at the field and the file. There is no `try/catch`-style "soft" config; an invalid `mode` is a hard error, not a fallback to `"development"`.
