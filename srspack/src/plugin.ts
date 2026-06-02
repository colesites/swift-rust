import type { SrspackConfig } from "./native.d.ts";

/**
 * Type-safe config factory. Use this in `srspack.config.ts`:
 *
 *   import { defineSrspackConfig } from "@swift-rust/srspack/plugin";
 *   export default defineSrspackConfig({ mode: "production", ... });
 */
export function defineSrspackConfig(config: SrspackConfig): SrspackConfig {
  return config;
}

/**
 * Load a config from `srspack.config.{ts,js,json}` relative to `cwd`.
 * Returns the empty default config if no file is found.
 */
export async function loadConfig(cwd: string = process.cwd()): Promise<SrspackConfig> {
  const candidates = ["srspack.config.ts", "srspack.config.js", "srspack.config.json"];

  for (const name of candidates) {
    const path = `${cwd}/${name}`;
    const file = Bun.file(path);
    if (await file.exists()) {
      if (name.endsWith(".json")) {
        return (await file.json()) as SrspackConfig;
      }
      const mod = (await import(path)) as { default?: SrspackConfig } & SrspackConfig;
      return mod.default ?? mod;
    }
  }

  return {
    mode: "development",
    outDir: "dist",
    sourcemap: true,
    minify: false,
    target: {},
    externals: [],
  };
}
