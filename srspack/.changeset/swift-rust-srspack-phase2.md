---
"@swift-rust/srspack": minor
---

Align `srspack-core` with the real `swift-rust-bundler` API. The Phase 1 stub
returned `anyhow::Error` and an `Output { files: Vec<OutputFile> }`; the Phase 2
wrapper now consumes the bundler's actual `Result<BundleOutput,
swift_rust_errors::Error>` where `BundleOutput.files: Vec<PathBuf>` and
`manifest: serde_json::Value`.

Other changes:

- `swift_rust_errors::Error` is now the canonical error type across `srspack-core`; the
  `From<swift_rust_errors::Error>` impl in `result.rs` bridges the gap.
- `build()` is the sync entry point (uses `futures::executor::block_on` internally to
  drive the async bundler). `build_async()` is exposed for true async contexts (the
  dev server).
- `BundleOptions`, `Mode`, and `Target` all derive `Serialize`/`Deserialize` so the
  `srspack config` subcommand can emit JSON and the config loader can parse it.
- The CLI binary now installs as `srspack` (renamed from `srspack-cli`) to match
  the docs and bench scripts.
- `populate_graph_from_disk` walks the project root with `walkdir`, respecting
  `.swift-rust/`, `node_modules/`, `.git/`, `dist/`, `.srspack-cache/` excludes.
- `record_assets` reads built files, computes blake3 hashes, and classifies MIME
  types via `mime_guess`.

Bench harness is now runnable end-to-end with three generated fixtures
(`small` = 50 modules, `medium` = 500 modules, `large` = 5000 modules). First
measured row appended to `bench/results.md`; numbers are dominated by file walk
because the bundler is still a scaffold stub.

Memory harness falls back to a `ps -o rss=` sampler at 100 Hz on macOS where
`/usr/bin/time -v` is unavailable; install `gnu-time` (`brew install gnu-time`)
for the GNU output.
