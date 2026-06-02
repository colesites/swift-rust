---
title: Architecture
---

# Architecture

srspack is a Rust bundler that the Swift-Rust framework embeds in-process. It has four layers, each small enough to hold in your head.

## 1. Discovery

`walkdir` walks the project root, respecting `.gitignore` and a few extra excludes (`.swift-rust/`, `node_modules/`, `dist/`). Each candidate file is hashed with blake3; the hash becomes the `ModuleId`. A second pass reads each file's source from disk in parallel (rayon).

Discovery is single-pass. We do not do "list, then read, then hash, then re-read" — that is what gives Rspack its cold-build tax.

## 2. Parsing

Each module is parsed by the loader that matches its extension. The TSX loader is in `crates/srspack-loader-tsx/`; the CSS loader is in `crates/srspack-loader-css/`. Loaders are async and may call into the Swift-Rust compiler for `import` resolution.

The output of a loader is a `LoaderOutput`: the transformed source, an optional sourcemap, and a flag indicating whether the result is cacheable. Cacheable results are stored in `ContentCache` keyed by the source's blake3 hash.

## 3. Graph construction

A single DAG holds three node kinds — `Module`, `Chunk`, `Asset` — in one `HashMap<u64, Node>`. There is no separate "module graph" and "chunk graph." When a module is added, its dependencies (returned by the loader) are added as edges. When a chunk is added, its constituent modules are looked up by id and added as edges in the same graph.

A topological sort of the graph drives the build scheduler. Cycles are reported with the full path of participating modules.

## 4. Output

The graph is walked in topo order, modules are concatenated per chunk, and the result is written to `out_dir`. A `manifest.json` is emitted alongside, but it is an **artifact** (for inspection), not a **protocol** (for inter-process communication). The Swift-Rust server reads the same in-memory `Output` that the bundler produced; no JSON parse happens in the hot path.

## Concurrency model

| Stage | Strategy |
|---|---|
| File walk | rayon parallel iterator |
| File read | rayon parallel iterator |
| Loader transform | tokio task pool (loaders can be async) |
| Graph mutation | single-writer via `parking_lot::RwLock` |
| Cache read | lock-free, `parking_lot::RwLock` for the map |
| Output write | tokio fs writes in parallel |

We use rayon for CPU-bound work, tokio for I/O. The split is deliberate: rayon is faster for the parse and topo-sort stages, and tokio's `fs` is faster for the output writes (because it batches syscalls).

## What lives where

- `crates/srspack-core` — graph, cache, loader trait, public `Srspack` type
- `crates/srspack-cli` — clap-based CLI: `build`, `dev`, `bench`, `config`, `info`
- `crates/srspack-loader-tsx` — TSX/JSX → Swift-Rust view template
- `crates/srspack-loader-css` — CSS + CSS Modules (`.module.css`)
- `lib/` — JS/TS interop, loaded by Bun at dev-server start
- `scripts/` — build, bench, publish, fmt, clippy
- `bench/` — reproducible benchmark harness
- `examples/` — runnable examples
- `../../crates/bundler/` — the underlying `swift-rust-bundler` that `srspack-core` re-exports
