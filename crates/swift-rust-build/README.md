# `swift-rust-build`

The build pipeline for swift-rust.

## Responsibilities

- **Project scanning** — discovers `app/` pages, layouts, API routes, and special files
- **Asset enumeration** — walks `public/` and classifies images, fonts, PDFs
- **Manifest generation** — writes `manifest.json` with input hashes, build ID, timestamp
- **Orchestration** — coordinates the `bundler` crate and emits the final build output

## Build inputs

- `BuildInput { project_root, mode, target }`

## Build outputs

- `BuildOutput { bundle, manifest, routes, assets, duration_ms }`

The actual JS/TS bundling lives in `bundler/`. This crate is intentionally
dumb about JS — it just runs the bundler and packages the result.
