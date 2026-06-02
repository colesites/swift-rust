---
"@swift-rust/srspack": minor
"@swift-rust/srspack-interop": minor
"srspack-core": minor
"srspack-cli": minor
"srspack-loader-tsx": minor
"srspack-loader-css": minor
---

Initial scaffold of `srspack/`, the bundler for Swift-Rust. This is a positioning sub-workspace that mirrors `vercel/next.js`'s `rspack/` layout; it does not fork Rspack.

The scaffold ships:

- A thin `srspack-core` Rust crate that re-exports `swift-rust-bundler` under the `srspack` name and adds a single unified dependency graph, a content-addressed `blake3` cache, and an async loader trait.
- A `srspack-cli` binary with `build`, `dev`, `bench`, `config`, and `info` subcommands.
- Two built-in loaders: `srspack-loader-tsx` (TSX/JSX → Swift-Rust view template) and `srspack-loader-css` (CSS + CSS Modules).
- A JS/TS interop layer at `lib/` (`@swift-rust/srspack` and `@swift-rust/srspack-interop` private packages) for the Bun-based dev server.
- A benchmark harness at `bench/` with cold-build, incremental, and memory scripts.
- Documentation at `docs/`: `why-srspack`, `architecture`, `perf`, `migration`, `config`, `loaders`.

Performance numbers in `docs/perf.md` are architectural projections, not measured; the bench harness is in place and the next release will replace them with measured values.
