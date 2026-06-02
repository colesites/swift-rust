# @swift-rust/pdf

A JSX tree for declaring server-side PDF documents. Compiles down to `printpdf` calls in the Rust bundler.

## Usage

```tsx
import { Document, Page, Text, View } from "swift-rust/pdf";

export default function Invoice({ items }: { items: { id: string; name: string; price: number }[] }) {
  return (
    <Document title="Invoice" author="Acme">
      <Page size="A4">
        <View x={50} y={50}>
          <Text fontSize={18}>Invoice</Text>
          {items.map((it) => (
            <Text key={it.id} y={0}>{it.name}: ${it.price}</Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
```
