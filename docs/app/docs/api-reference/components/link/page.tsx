import { DocArticle } from "@/app/components/doc-article";
export const metadata = { title: "Link component" };

export default function LinkRefPage() {
  return (
    <DocArticle>
      <h1>Link</h1>
      <p>
        The <code>&lt;Link&gt;</code> component is the foundation of client-side navigation. It
        renders an <code>&lt;a&gt;</code> tag with prefetching enabled.
      </p>

      <h2>Import</h2>
      <div className="code-block">
        <div className="code-block-header">
          <span>usage</span>
        </div>
        <pre>
          <code>{`import { Link } from "swift-rust";`}</code>
        </pre>
      </div>

      <h2>Props</h2>
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
              Prop
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
              <code>href</code>
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>
              <code>string</code>
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>—</td>
          </tr>
          <tr>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>
              <code>prefetch</code>
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>
              <code>boolean</code>
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>true</td>
          </tr>
          <tr>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>
              <code>replace</code>
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>
              <code>boolean</code>
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>false</td>
          </tr>
          <tr>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>
              <code>scroll</code>
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>
              <code>boolean</code>
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>true</td>
          </tr>
        </tbody>
      </table>

      <h2>Usage</h2>
      <div className="code-block">
        <div className="code-block-header">
          <span>usage</span>
        </div>
        <pre>
          <code>{`<Link href="/blog/hello">Read more</Link>
<Link href="/dashboard" replace>Back to dashboard</Link>
<Link href="/external" target="_blank" rel="noopener noreferrer">External</Link>`}</code>
        </pre>
      </div>
    </DocArticle>
  );
}
