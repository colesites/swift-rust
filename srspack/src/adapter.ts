import type { BuildOutput, BundleOptions, SrspackConfig, SrspackPlugin } from "./native.d.ts";

/**
 * Adapter that the Swift-Rust dev server imports. It boots the native
 * srspack-core (loaded via Bun's NAPI bindings), runs the build, and
 * exposes a small, typed JS surface to the rest of the framework.
 *
 * The real implementation will call into a NAPI module produced by
 * `napi-rs`; for now this is a typed shim that the dev server can
 * mock against.
 */
export class SrspackAdapter {
  private opts: BundleOptions;
  private plugins: SrspackPlugin[];

  constructor(config: SrspackConfig) {
    this.opts = pickBundleOptions(config);
    this.plugins = config.plugins ?? [];
  }

  async build(root: string): Promise<BuildOutput> {
    for (const plugin of this.plugins) {
      await plugin.apply({
        options: this.opts,
        hooks: {
          onResolve: () => {},
          onTransform: () => {},
          onBuild: () => {},
        },
      });
    }

    return {
      files: [],
      manifest: { version: 0, mode: this.opts.mode },
      outDir: this.opts.outDir,
    };
  }

  async watch(root: string, onChange: (output: BuildOutput) => void): Promise<() => void> {
    const stop = await startNativeWatcher(root, this.opts, async (output) => {
      await onChange(output);
    });
    return stop;
  }

  get options(): BundleOptions {
    return this.opts;
  }
}

function pickBundleOptions(config: SrspackConfig): BundleOptions {
  return {
    mode: config.mode,
    outDir: config.outDir,
    sourcemap: config.sourcemap,
    minify: config.minify,
    target: config.target,
    externals: config.externals,
  };
}

async function startNativeWatcher(
  root: string,
  _opts: BundleOptions,
  onBuild: (output: BuildOutput) => Promise<void>,
): Promise<() => void> {
  const interval = setInterval(() => {}, 2 ** 31 - 1);
  void onBuild;
  return async () => {
    clearInterval(interval);
  };
}
