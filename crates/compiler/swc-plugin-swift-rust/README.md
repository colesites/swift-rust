# swc-plugin-swift-rust

SWC plugin that walks JSX in `.tsx` / `.jsx` files and rewrites it into a neutral form the bundler can hand off to the Rust code generator. Compiles to a `cdylib` (native loader) or to `wasm32-unknown-unknown` for the WASM loader.

## Build

```bash
# Native (for dev / tests)
cargo build

# WASM (for the bundled loader)
rustup target add wasm32-unknown-unknown
cargo build --target wasm32-unknown-unknown --release
```

## Configuration

The plugin receives a JSON `config` blob from the bundler:

```json
{
  "rendering": "ssr-wasm",
  "componentPrefix": "SwiftRust"
}
```
