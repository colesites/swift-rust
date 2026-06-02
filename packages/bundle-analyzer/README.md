# @swift-rust/bundle-analyzer

Identifies what's actually inside your production bundle. Wraps the bundler output and emits a treemap you can open in a browser.

## Usage

```ts
import { withBundleAnalyzer } from "@swift-rust/bundle-analyzer";

export default withBundleAnalyzer({
  // swift-rust config
}, {
  enabled: process.env.ANALYZE === "true",
});
```

Then run:

```bash
ANALYZE=true bun swift-rust build
open .swift-rust/analyze/client.html
```
