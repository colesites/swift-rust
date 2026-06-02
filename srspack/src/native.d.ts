/**
 * Type definitions for the native srspack-core API. This file mirrors
 * the Rust structs in `srspack-core/src/{options,graph,result,loader}.rs`
 * — keep both in sync.
 */

export type Mode = "development" | "production";

export interface BundleOptions {
  mode: Mode;
  outDir: string;
  sourcemap: boolean;
  minify: boolean;
  target: Target;
  externals: string[];
}

export interface Target {
  browsers?: string[];
  node?: string;
  deno?: string;
  bun?: string;
}

export interface OutputFile {
  path: string;
  bytes: Uint8Array;
  kind: "js" | "css" | "html" | "json" | "asset";
}

export interface BuildOutput {
  files: OutputFile[];
  manifest: Record<string, unknown>;
  outDir: string;
}

export interface LoaderRule {
  test: RegExp | string;
  use: string | string[] | LoaderDefinition;
  enforce?: "pre" | "post";
}

export interface LoaderDefinition {
  loader: string;
  options?: Record<string, unknown>;
}

export interface SrspackPlugin {
  name: string;
  apply: (api: SrspackPluginApi) => void | Promise<void>;
}

export interface SrspackPluginApi {
  options: BundleOptions;
  hooks: {
    onResolve: (cb: (specifier: string) => string | undefined) => void;
    onTransform: (cb: (file: string, code: string) => string | Promise<string>) => void;
    onBuild: (cb: (output: BuildOutput) => void | Promise<void>) => void;
  };
}

export type SrspackConfig = BundleOptions & {
  loaders?: LoaderRule[];
  plugins?: SrspackPlugin[];
};
