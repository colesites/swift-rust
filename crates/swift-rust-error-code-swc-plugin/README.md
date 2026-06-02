# `swift-rust-error-code-swc-plugin`

SWC plugin that injects stable error codes into compiled output.

## Why

When `notFound()` is called at runtime, the framework needs to know what
to do with it. It could try to inspect the call site, but that's slow
and fragile. A better approach: at *compile time*, the SWC plugin
rewrites every `notFound()` and `redirect()` call to carry a stable
error code, like `SR-E1404`. At runtime, the framework just looks the
code up in a table.

## Codes

| Code | Meaning |
| --- | --- |
| `SR-E1404` | `notFound()` was called |
| `SR-E1301` | `redirect()` was called |
| `SR-E0001` | Generic compile error |
| `SR-E0501` | Hydration mismatch |
| `SR-E0901` | Network request failed |
| `SR-E0002` | Server failed to start |

## Where the real plugin lives

The actual `swc_core`-dependent plugin lives in `crates/compiler/`,
which is a separate sub-workspace because of `swc_core`'s pinned
dependencies. This crate is the stable Rust contract and is test-only.
