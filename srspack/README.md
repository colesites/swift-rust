# srspack

The bundler for Swift-Rust. A native Rust, single-graph, content-addressed bundler that ships with the framework. No Node.js, no JSON manifests, no plugin bridges — just a Rust core that the Swift-Rust compiler, server, and dev tools all link into directly.

srspack is what `swift-rust-bundler` becomes when it stops pretending to be a generic bundler and leans into being the Swift-Rust bundler. The two are the same code; srspack is the public, standalone name.

## Why a separate folder

`srspack/` is a sibling sub-workspace inside the Swift-Rust monorepo, mirroring the layout of `vercel/next.js`'s `rspack/` directory. It exists for three reasons:

1. **Versioning** — srspack can move at its own cadence without dragging the framework workspace. A breaking change to the loader API can ship as `srspack 0.2.0` while the framework stays on `0.1.x`.
2. **Discoverability** — a top-level `srspack/` directory is the first thing an ex-Next.js developer looks for, and the first thing the docs site links to. Hiding the bundler inside `crates/bundler/` is fine for compiler engineers and bad for everyone else.
3. **Reuse surface** — third-party Rust crates (a future `srspack-postcss`, `srspack-sass`, `srspack-swc`) live in their own crates under `srspack/crates/` and can be depended on directly without going through the framework.

## Layout

```
srspack/
├── README.md
├── CHANGELOG.md
├── LICENSE
├── Cargo.toml                 # sub-workspace root
├── crates/
│   ├── srspack-core/          # the bundler core (re-exports + extends swift-rust-bundler)
│   ├── srspack-cli/           # `srspack build`, `srspack dev`, `srspack bench`
│   ├── srspack-loader-tsx/    # TSX → Rust view template loader
│   └── srspack-loader-css/    # CSS Modules + PostCSS loader
├── lib/                       # JS/TS interop (Bun runtime, dev-server hooks)
├── scripts/                   # build, bench, publish, fmt
├── docs/                      # why-srspack, architecture, perf, migration
├── bench/                     # reproducible benchmark harness + results
└── examples/                  # runnable examples
```

## Quick start

```bash
# Build the srspack binary
cd srspack && cargo build --release

# Bundle a Swift-Rust app
./target/release/srspack build --config srspack.config.json --out dist

# Watch mode for development
./target/release/srspack dev --config srspack.config.json
```

## Position vs Rspack

| | Rspack | srspack |
|---|---|---|
| Language | Rust + JS plugin bridge | Rust only |
| Module graph | separate from chunk graph | **single unified graph** |
| Compiler bridge | JSON manifest IPC | **native Rust call** |
| Cache key | path + mtime | **blake3 content hash** |
| Config surface | webpack-compatible (large) | **Swift-Rust-native (small)** |
| Dev process | one process per tool | **shared with framework** |
| Cold build (1000 modules) | ~1.2s | **~0.4s (projected)** |
| HMR (single module) | ~50ms | **~12ms (projected)** |

The "projected" rows are architectural projections from the design, not measured numbers — see `bench/` for the harness and `docs/perf.md` for the methodology. We do not publish numbers we have not measured.

## Relationship to the rest of Swift-Rust

- The actual bundler implementation lives in `crates/bundler/` (workspace member, name `swift-rust-bundler`).
- `srspack-core` depends on `swift-rust-bundler` via a path dependency and re-exports the public API under the `srspack` name.
- The Swift-Rust compiler (`crates/compiler`) calls `srspack-core` directly via the same `cargo` build, not over an IPC boundary.
- The Swift-Rust server (`crates/server`) embeds `srspack-core` for dev-mode file watching, so a dev request never round-trips through a child process.

## See also

- `docs/why-srspack.md` — the case for a Swift-Rust-native bundler
- `docs/architecture.md` — how the single graph works
- `docs/perf.md` — benchmark methodology and results
- `docs/migration.md` — moving a project from webpack/Rspack
- `bench/` — reproducible numbers
- `../../crates/bundler/` — the underlying implementation
