import { Inter } from "@swift-rust/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function FontDocsPage() {
  void inter;
  return (
    <article>
      <h1>Font</h1>
      <p>
        Use Google Fonts or self-hosted fonts. The bundler generates <code>@font-face</code> rules
        and <code>size-adjust</code> fallbacks to prevent layout shift.
      </p>
      <pre>
        <code>{`import { Inter } from "@swift-rust/font/google";
const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html className={inter.className}><body>{children}</body></html>;
}`}</code>
      </pre>
      <h2>Local fonts</h2>
      <pre>
        <code>{`import localFont from "@swift-rust/font/local";
const myFont = localFont({ src: "./fonts/MyFont.woff2" });`}</code>
      </pre>
    </article>
  );
}
