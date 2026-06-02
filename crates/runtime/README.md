# swift-rust-runtime

WASM-compiled client runtime. Handles hydration of server-rendered HTML, client-side navigation, event delegation, and global state.

## Building for WASM

```bash
wasm-pack build --target web --out-dir ../packages/runtime-dist
```

## Entry points

- `start` — runs on module load. Initializes console and panic hook.
- `hydrate(payload)` — accepts a `HydrationData` JSON blob and attaches event listeners to the server-rendered DOM.
- `navigate(path)` — client-side route transition via the History API.
