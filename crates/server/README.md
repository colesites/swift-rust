# swift-rust-server

HTTP server built on `axum`, with a `matchit`-powered file-system router. Handles SSR responses, asset serving, and hot-reload SSE streams during development.

## Responsibilities

- Bind to a TCP port and serve HTTP/1.1 + HTTP/2.
- Route file-system based pages to render handlers.
- Stream hot-reload events to the browser during `dev`.
- Compress responses with gzip and brotli.
