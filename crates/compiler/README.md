# swift-rust/compiler

Sub-workspace for the SWC plugin that powers the JSX → Rust transform. It is intentionally isolated from the main workspace because SWC plugins require their own toolchain target and dependency footprint.

## Status

This sub-workspace is a **scaffold stub**. The plugin entry point is wired up and the file structure is in place, but the `swc_core` version pinned here is known to have transitive-dep conflicts with the latest stable Rust. To compile it successfully you may need to:

- Update `swc_core` to a newer minor (test `0.110`+).
- Pin `serde` and `serde_json` to versions compatible with the chosen `swc_core`.
- Run with the `wasm32-unknown-unknown` target installed (`rustup target add wasm32-unknown-unknown`).

A future task will set up CI matrix builds for this sub-workspace and pin the working combination.

## Layout

```
compiler/
├── Cargo.toml                # sub-workspace
└── swc-plugin-swift-rust/    # the plugin crate
    ├── Cargo.toml
    └── src/lib.rs
```

## Build (when stabilized)

```bash
cd crates/compiler
cargo build
```

## Why is this a sub-workspace?

SWC plugins compile to a `cdylib` that the bundler loads via `libloading` (native) or as a WASM module (browser). Both modes need a fixed, narrow dep tree. Excluding this from the main workspace prevents any transitive bump from breaking the plugin.
