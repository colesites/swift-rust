export interface AnalyzerOptions {
  enabled?: boolean;
  outDir?: string;
  reportFilename?: string;
  showOutput?: boolean;
  defaultSizes?: "stat" | "parsed" | "gzip";
}

export const withBundleAnalyzer = (
  config: { bundleAnalyzer?: AnalyzerOptions } = {},
  options: AnalyzerOptions = {},
): { bundleAnalyzer: AnalyzerOptions } => {
  return {
    bundleAnalyzer: {
      enabled: true,
      defaultSizes: "gzip",
      outDir: ".swift-rust/analyze",
      reportFilename: "client.html",
      showOutput: true,
      ...options,
      ...config.bundleAnalyzer,
    },
  };
};

export const isEnabled = (config: { bundleAnalyzer?: AnalyzerOptions }): boolean =>
  Boolean(config.bundleAnalyzer?.enabled);
