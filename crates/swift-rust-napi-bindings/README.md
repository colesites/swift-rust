# `swift-rust-napi-bindings`

Node-API (napi-rs) bindings for swift-rust.

## When to use this

Most users won't need this crate. The `swift-rust` JS package re-exports
all the runtime functionality. But if you're embedding swift-rust into a
Node.js host — a custom server, an Electron app, a CLI tool — you can
use this crate to load the runtime directly.

## Bun is still preferred

Bun is the recommended host. Node.js 20+ is fully supported, but Bun's
native ESM + JSX + TS handling means you don't have to ship a separate
TypeScript build step.

## Functions exposed

- `version()` — return the swift-rust version
- `capabilities()` — return an object describing what the runtime supports
- `render(input)` — render a component tree to HTML
- `parse_method(str)` — parse an HTTP method string
