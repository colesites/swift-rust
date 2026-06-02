# `wasm`

WASM bindings for the swift-rust runtime.

## What this crate does

When a swift-rust app is built in `ssr-wasm` or `wasm` mode, the
client-side JavaScript bundle needs to talk to Rust primitives
(component renderer, image codec, font subsetter). This crate exposes
those primitives through `wasm-bindgen`.

## Exposed functions

- `render(req)` — render a component tree to HTML
- `version()` — return the swift-rust version
- `capabilities()` — return an object describing what the runtime supports

## Build target

```sh
cargo build -p wasm --target wasm32-unknown-unknown
```

## Notes

- `no_std` on purpose — this crate runs in browsers
- `cdylib` crate type so it links into JS via `wasm-bindgen`
- The real client-side component renderer lives elsewhere; this crate is
  the public API surface
