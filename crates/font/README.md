# swift-rust-font

The `<Font>` system. Loads Google Fonts at build time, subsets them for the requested characters, measures fallback metrics for layout-shift-free loading, and exposes a `Font` helper for Next.js-style usage.

## Build-time flow

1. Resolve font from `google`, `local`, or filesystem source.
2. Download (or copy) the requested weights/styles.
3. Subset to the requested character set.
4. Self-host the `.woff2` files in `.swift-rust/static/fonts/`.
5. Generate CSS with `size-adjust` and `ascent-override` to minimize CLS.
