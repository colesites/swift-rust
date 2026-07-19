---
"swift-rust": patch
---

Keep Windows drive paths, UNC paths, and POSIX absolute paths inside development SSR bundles so
the dev server no longer triggers a zero-chunk Bun build on Windows.
