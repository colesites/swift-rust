export const metadata = { title: "Head & Meta" };

export default function HeadRefPage() {
  return (
    <article className="prose">
      <h1>Head &amp; Meta</h1>
      <p>
        For custom meta tags not covered by the <code>metadata</code> export, use <code>Head</code>,{" "}
        <code>Title</code>, <code>Meta</code>, and <code>Style</code>.
      </p>

      <h2>Import</h2>
      <div className="code-block">
        <div className="code-block-header">
          <span>usage</span>
        </div>
        <pre>
          <code>{`import { Head, Title, Meta, Style } from "swift-rust";`}</code>
        </pre>
      </div>

      <h2>Usage</h2>
      <div className="code-block">
        <div className="code-block-header">
          <span>usage</span>
        </div>
        <pre>
          <code>{`export default function Page() {
  return (
    <>
      <Head>
        <Title>My page</Title>
        <Meta name="description" content="..." />
        <Meta property="og:title" content="..." />
        <Style>{\`
          .my-class { color: red; }
        \`}</Style>
      </Head>
      <main>...</main>
    </>
  );
}`}</code>
        </pre>
      </div>
    </article>
  );
}
