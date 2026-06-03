import { DocArticle } from "@/app/components/doc-article";
import { renderMarkdown } from "@/app/components/markdown";

export const metadata = { title: "PDF component" };

const MD = `# PDF
Two APIs in one package:
- **Generator** — \`<Document>\`, \`<Page>\`, \`<Text>\`, \`<View>\` for building a PDF document tree that the framework serializes to bytes.
- **Viewer** — \`<Pdf>\` for rendering an existing PDF in the page with multi-page navigation, zoom, and error states.
## Generator
### Import
\`\`\`ts
import { Document, Page, Text, View } from "swift-rust/pdf";
\`\`\`
### \`<Document>\` props
| Prop | Type |
|---|---|
| \`title\` | \`string\` |
| \`author\` | \`string\` |
| \`subject\` | \`string\` |
### \`<Page>\` props
| Prop | Type | Default |
|---|---|---|
| \`size\` | \`"A4" \\| "A3" \\| "Letter" \\| "Legal" \\| "Tabloid"\` | \`"A4"\` |
| \`orientation\` | \`"portrait" \\| "landscape"\` | \`"portrait"\` |
| \`margin\` | \`number\` | \`50\` |
### Example
\`\`\`tsx
const tree = (
<Document title="Invoice" author="Acme">
<Page size="A4" margin={50}>
<View>
<Text x={0} y={0} fontSize={20}>Invoice #123</Text>
<Text x={0} y={30} fontSize={12}>Due 2026-06-15</Text>
</View>
</Page>
</Document>
);
\`\`\`
From a route handler, return \`Response.pdf(tree)\` with the document tree as children.
## Viewer
### Import
\`\`\`ts
import { Pdf, PdfError } from "swift-rust/pdf";
\`\`\`
\`PdfError\` has stable \`code: "SR0152"\` for load failures and \`code: "SR0153"\` for render failures.
### \`<Pdf>\` props
| Prop | Type | Default | Description |
|---|---|---|---|
| \`src\` | \`string \\| { url: string; data?: ArrayBuffer \\| Uint8Array }\` | — | URL or \`{ url, data }\` for an in-memory PDF. Required. |
| \`width\` | \`number \\| string\` | \`"100%"\` | CSS width of the viewer. |
| \`height\` | \`number \\| string\` | \`720\` | CSS height of the viewer. |
| \`initialPage\` | \`number\` | \`1\` | Page to show on mount. Clamped to \`[1, numPages]\`. |
| \`initialScale\` | \`number \\| "fit-width" \\| "fit-page"\` | \`"fit-width"\` | Initial scale. Number is a multiplier; modes are self-sizing. |
| \`showControls\` | \`boolean\` | \`true\` | Show the page navigation and zoom bar. |
| \`showPageNumbers\` | \`boolean\` | \`true\` | Show the page number input. |
| \`renderTextLayer\` | \`boolean\` | \`false\` | Render the PDF text layer for selection. Doubles memory. |
| \`workerSrc\` | \`string\` | jsDelivr CDN | Override the PDF.js worker URL. |
| \`onLoad\` | \`(info: { numPages, title?, author?, subject? }) => void\` | — | Fired once after the document is parsed. |
| \`onPageChange\` | \`(page: number) => void\` | — | Fired when the user navigates pages. |
| \`onError\` | \`(err: PdfError) => void\` | — | Fired for load and render failures. |
| \`fallback\` | \`ReactNode\` | download link | Rendered during SSR and before hydration. |
| \`errorFallback\` | \`ReactNode \\| (err) => ReactNode\` | built-in error UI | Rendered in place of the viewer on a load or render failure. |
| \`loading\` | \`ReactNode\` | "Loading PDF…" | Rendered while the document is being fetched. |
### Example
\`\`\`tsx
"use client";
import { Pdf } from "swift-rust/pdf";
export function Manual() {
<Pdf
src="/docs/manual.pdf"
width="100%"
height={900}
initialPage={1}
onLoad={(info) => console.log(\`loaded \${info.numPages} pages\`)}
onError={(err) => console.error(err.code, err.message)}
/>
);
}
\`\`\`
### Keyboard
The viewer is a \`tabIndex={0}\` region. When focused:
- \`←\` / \`PageUp\` — previous page
- \`→\` / \`PageDown\` / \`Space\` — next page
- \`Home\` — first page
- \`End\` — last page
- \`+\` / \`=\` — zoom in
- \`-\` / \`_\` — zoom out
### SSR
The viewer is client-only. On the server, the \`fallback\` is rendered (a download link by default). After hydration, the viewer mounts and replaces the fallback. The PDF.js worker is loaded lazily from the configured \`workerSrc\` (default: jsDelivr CDN).
### Failure modes
| \`err.code\` | \`err.kind\` | Cause |
|---|---|---|
| \`SR0152\` | \`"load"\` | Generic load failure (caught any other reason) |
| \`SR0152\` | \`"network"\` | Network error (offline, DNS, CORS) |
| \`SR0152\` | \`"invalid"\` | Bytes were fetched but are not a valid PDF |
| \`SR0153\` | \`"render"\` | Page could not be rasterized (canvas limit, broken font) |
Render errors immediately after a page change are cancellations and are safe to ignore. See \`SR0153\` for the dispatch logic.
### Dependencies
The viewer depends on \`pdfjs-dist@^4.7.0\` (a runtime dep, not a peer). It is dynamically imported in the browser, so the SSR bundle does not include it. The PDF.js worker is loaded from the CDN by default; override \`workerSrc\` to bundle it locally.`;

export default function ApiRefPage() {
  return <DocArticle>{renderMarkdown(MD)}</DocArticle>;
}
