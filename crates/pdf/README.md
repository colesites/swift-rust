# swift-rust-pdf

Server-side PDF generation. Provides a JSX component tree (`<Document>`, `<Page>`, `<Text>`, `<View>`, `<Image>`, `<Link>`) that compiles down to `printpdf` calls.

## Usage from a route

```rust
use swift_rust_pdf::{DocumentBuilder, PageProps, PageSize, Orientation};

let mut doc = DocumentBuilder::new();
doc.add_page(PageProps { size: PageSize::A4, orientation: Orientation::Portrait, margin: 50.0 });
let bytes = doc.build()?;
```
