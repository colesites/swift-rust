# swift-rust-image

The `<Image>` component. Optimizes images on demand, generates responsive `srcset` attributes, and lazy-loads by default.

## Server API

- `/_next/image?url=&w=&q=` — proxied optimized image endpoint.
- Caches optimized variants in `.swift-rust/cache/images/` keyed by content hash.
