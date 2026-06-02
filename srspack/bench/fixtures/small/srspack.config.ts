import { defineSrspackConfig } from "@swift-rust/srspack/plugin";

export default defineSrspackConfig({
  mode: "production",
  outDir: "dist",
  sourcemap: true,
  minify: true,
  target: { bun: ">=1.3.0" },
  externals: [],
  loaders: [
    { test: /\.tsx?$/, use: "tsx" },
    { test: /\.module\.css$/, use: "css" },
    { test: /\.css$/, use: "css" },
  ],
  plugins: [],
});
