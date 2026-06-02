export const metadata = { title: "PDFs" };

export default function PdfsPage() {
  return (
    <article className="prose">
      <h1>PDFs</h1>
      <p>
        Swift Rust includes a declarative PDF component tree. You write{" "}
        <code>&lt;Document&gt;</code>, <code>&lt;Page&gt;</code>, <code>&lt;Text&gt;</code>, and{" "}
        <code>&lt;View&gt;</code> like TSX, and the framework compiles them into a PDF binary.
      </p>

      <h2>A simple invoice</h2>
      <div className="code-block">
        <div className="code-block-header">
          <span>app/api/invoice/[id]/route.ts</span>
        </div>
        <pre>
          <code>{`import { Document, Page, Text, View } from "swift-rust/pdf";

export async function GET() {
  return Response.pdf(
    <Document title="Invoice #1001" author="Acme Co.">
      <Page size="A4" margin={50}>
        <View>
          <Text fontSize={24} fontFamily="Helvetica-Bold">Invoice #1001</Text>
          <Text fontSize={12}>Billed to: Acme Customer</Text>
        </View>
        <View x={0} y={400}>
          <Text fontSize={10}>Thanks for your business.</Text>
        </View>
      </Page>
    </Document>
  );
}`}</code>
        </pre>
      </div>

      <h2>Page sizes</h2>
      <p>
        Page sizes: <code>"A4"</code>, <code>"A3"</code>, <code>"Letter"</code>,{" "}
        <code>"Legal"</code>, <code>"Tabloid"</code>. Orientations: <code>"portrait"</code>{" "}
        (default) or <code>"landscape"</code>.
      </p>

      <h2>Configuration</h2>
      <div className="code-block">
        <div className="code-block-header">
          <span>swift-rust.config.json</span>
        </div>
        <pre>
          <code>{`{
  "pdf": {
    "defaultPageSize": "A4",
    "defaultOrientation": "portrait",
    "compress": true
  }
}`}</code>
        </pre>
      </div>

      <h2>Next steps</h2>
      <p>
        Continue to <a href="/docs/getting-started/deploying">Deploying</a>.
      </p>
    </article>
  );
}
