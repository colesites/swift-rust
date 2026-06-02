export const metadata = { title: "Fonts" };

export default function FontsPage() {
  return (
    <article className="prose">
      <h1>Fonts</h1>
      <p>
        Swift Rust ships with 2,071 Google fonts and supports self-hosted local fonts (OTF, TTF,
        WOFF, WOFF2). Font handling is automatic: the framework generates <code>@font-face</code>{" "}
        rules, preloads critical fonts, and applies <code>size-adjust</code> fallbacks to prevent
        layout shift.
      </p>

      <h2>Google fonts</h2>
      <p>
        Import a font from <code>swift-rust/font/google</code> and call it as a function:
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>app/layout.tsx</span>
        </div>
        <pre>
          <code>{`import { Inter, JetBrains_Mono } from "swift-rust/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], display: "swap" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={\`\${inter.variable} \${mono.variable}\`}>
      <body>{children}</body>
    </html>
  );
}`}</code>
        </pre>
      </div>

      <h2>Browse all 2,071 fonts</h2>
      <p>
        See the <a href="/fonts">live font preview</a> to browse every font with sample text.
      </p>

      <h2>Local fonts</h2>
      <p>
        Use <code>localFont</code> for self-hosted fonts. The framework will serve them at{" "}
        <code>/_swift-rust/fonts/&lt;path&gt;</code> in dev.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>app/fonts.ts</span>
        </div>
        <pre>
          <code>{`import localFont from "swift-rust/font/local";

const myFont = localFont({
  src: "./fonts/MyFont.woff2",
  weight: "400 700",
  display: "swap",
});`}</code>
        </pre>
      </div>

      <h2>Using a font</h2>
      <p>
        Once loaded, apply the font via the <code>className</code>, the <code>style</code> prop, or
        the CSS variable.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>usage</span>
        </div>
        <pre>
          <code>{`<h1 className={inter.className}>Hello</h1>
<p style={inter.style}>Hello</p>
<div style={{ fontFamily: 'var(--font-inter)' }}>Hello</div>`}</code>
        </pre>
      </div>

      <h2>Next steps</h2>
      <p>
        Continue to <a href="/docs/getting-started/images">Images</a>.
      </p>
    </article>
  );
}
