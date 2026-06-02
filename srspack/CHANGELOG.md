# Changelog

All notable changes to srspack are documented in this file. The format follows [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Initial scaffold: sub-workspace with `srspack-core`, `srspack-cli`, `srspack-loader-tsx`, `srspack-loader-css`.
- JS/TS interop layer at `lib/` (Bun runtime adapter + plugin hook).
- Content-addressed cache with blake3.
- Single unified dependency graph (module + chunk + asset in one DAG).
- `srspack build`, `srspack dev`, `srspack bench` CLI subcommands.
- Benchmark harness at `bench/` (cold build, incremental, memory).
- Documentation at `docs/`: why-srspack, architecture, perf, migration, config, loaders.

### Known limitations
- Cold-build and HMR numbers in `docs/perf.md` are architectural projections, not measured. The bench harness is in place; numbers will be filled in after the first reproducible run.

## [0.0.0] — Scaffold

Placeholder version. No crates published yet.
