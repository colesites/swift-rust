import { DocArticle } from "@/app/components/doc-article";
export const metadata = { title: "Font component" };

export default function FontRefPage() {
  return (
    <DocArticle>
      <h1>Font</h1>
      <p>
        2,071 Google fonts and unlimited local fonts. The <code>FontOptions</code> type configures a
        font's loading behavior.
      </p>

      <h2>Import</h2>
      <div className="code-block">
        <div className="code-block-header">
          <span>google</span>
        </div>
        <pre>
          <code>{`import { Inter, Roboto_Mono } from "swift-rust/font/google";`}</code>
        </pre>
      </div>
      <div className="code-block">
        <div className="code-block-header">
          <span>local</span>
        </div>
        <pre>
          <code>{`import localFont from "swift-rust/font/local";`}</code>
        </pre>
      </div>

      <h2>
        <code>FontOptions</code>
      </h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                padding: "0.5rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              Option
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "0.5rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              Type
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "0.5rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              Default
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>
              <code>subsets</code>
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>
              <code>FontSubset[]</code>
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>
              ["latin"]
            </td>
          </tr>
          <tr>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>
              <code>display</code>
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>
              <code>FontDisplay</code>
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>"swap"</td>
          </tr>
          <tr>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>
              <code>weight</code>
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>
              <code>FontWeight | FontWeight[]</code>
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>[400]</td>
          </tr>
          <tr>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>
              <code>style</code>
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>
              <code>FontStyle | FontStyle[]</code>
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>
              ["normal"]
            </td>
          </tr>
          <tr>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>
              <code>variable</code>
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>
              <code>boolean</code>
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>false</td>
          </tr>
          <tr>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>
              <code>preload</code>
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>
              <code>boolean</code>
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>true</td>
          </tr>
          <tr>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>
              <code>adjustFontFallback</code>
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>
              <code>boolean</code>
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>true</td>
          </tr>
        </tbody>
      </table>

      <h2>Example</h2>
      <div className="code-block">
        <div className="code-block-header">
          <span>usage</span>
        </div>
        <pre>
          <code>{`const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: true,
  preload: true,
});`}</code>
        </pre>
      </div>

      <h2>Browse all 2,071 fonts</h2>
      <p>
        See the <a href="/fonts">live font preview</a> for the full list.
      </p>
    </DocArticle>
  );
}
