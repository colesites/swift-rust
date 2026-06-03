import { DocArticle } from "@/app/components/doc-article";
export const metadata = { title: "Configuration" };

export default function ConfigRefPage() {
  return (
    <DocArticle>
      <h1>Configuration</h1>
      <p>
        Swift Rust is configured via <code>swift-rust.config.json</code> at the project root.
      </p>

      <h2>Schema</h2>
      <div className="code-block">
        <div className="code-block-header">
          <span>swift-rust.config.json</span>
        </div>
        <pre>
          <code>{`{
  "rendering": "ssr-wasm",
  "image": {
    "domains": ["cdn.example.com"],
    "formats": ["image/avif", "image/webp"],
    "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    "imageSizes": [16, 32, 48, 64, 96, 128, 256, 384],
    "minimumCacheTTL": 60
  },
  "font": {
    "subsets": ["latin"],
    "display": "swap",
    "preload": true,
    "adjustFontFallback": true,
    "fallback": ["system-ui", "sans-serif"]
  },
  "pdf": {
    "defaultPageSize": "A4",
    "defaultOrientation": "portrait",
    "compress": true
  }
}`}</code>
        </pre>
      </div>

      <h2>TypeScript</h2>
      <p>
        For type-safe config, use <code>defineConfig</code>:
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>swift-rust.config.ts</span>
        </div>
        <pre>
          <code>{`import { defineConfig } from "swift-rust";

export default defineConfig({
  rendering: "ssr-wasm",
  image: { domains: ["cdn.example.com"] },
  font: { subsets: ["latin"], display: "swap" },
});`}</code>
        </pre>
      </div>
    </DocArticle>
  );
}
