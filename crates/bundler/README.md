# swift-rust-bundler

Asset bundler, file watcher, and build orchestrator. Discovers routes from the `app/` directory, transforms JSX/TSX through the SWC plugin, optimizes assets, and writes a production-ready bundle to `.swift-rust/`.

## Pipeline

1. **Discover** — Walk `app/` to enumerate routes and components.
2. **Transform** — Run each `.tsx`/`.jsx` file through the SWC JSX→Rust plugin.
3. **Compile** — Hand the transformed Rust sources to `rustc` (or `wasm-pack` for client code).
4. **Optimize** — Pass images through the image component, fonts through the font component.
5. **Emit** — Write final binary, WASM, CSS, and assets to the output directory.
