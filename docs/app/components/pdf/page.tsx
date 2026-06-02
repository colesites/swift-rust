export default function PdfDocsPage() {
  return (
    <article>
      <h1>Pdf</h1>
      <p>Server-side PDF generation with a TSX component tree.</p>
      <pre>
        <code>{`import { Document, Page, Text, View } from "@swift-rust/pdf";

export default function Invoice({ items }: { items: Item[] }) {
  return (
    <Document>
      <Page size="A4">
        <View>
          <Text>Invoice</Text>
          {items.map((it) => (
            <Text key={it.id}>{it.name}: \${it.price}</Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}`}</code>
      </pre>
      <h2>Configuration</h2>
      <pre>
        <code>{`{
  "pdf": {
    "defaultPageSize": "A4",
    "defaultOrientation": "portrait"
  }
}`}</code>
      </pre>
    </article>
  );
}
