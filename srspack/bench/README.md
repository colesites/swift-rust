# srspack benchmarks

This directory holds a reproducible benchmark harness for srspack. The harness exercises three workloads: cold build, incremental build, and peak memory.

## Layout

```
bench/
├── README.md           # this file
├── cold-build.sh       # cold build: clear cache, time a build
├── incremental.sh      # incremental: touch one file, time the rebuild
├── memory.sh           # memory: /usr/bin/time -v
└── results.md          # output of the latest run
```

## Fixtures

The harness expects a fixture directory passed via `--fixture-dir` (default `./bench/fixtures`). Each fixture is a small Swift-Rust project with a known number of modules. The shipped fixtures are:

| Fixture | Modules | Notes |
|---|---|---|
| `small` | 50 | 1 page, 1 layout, 1 css module, 0 dynamic imports |
| `medium` | 500 | 10 pages, 10 layouts, 50 css modules, 5 dynamic imports |
| `large` | 5000 | 100 pages, 100 layouts, 500 css modules, 50 dynamic imports |

A `huge` fixture (50 000 modules) is planned but not yet committed.

## Running

```bash
cd srspack
cargo build --release
./bench/cold-build.sh --fixture-dir ./bench/fixtures/medium
./bench/incremental.sh --fixture-dir ./bench/fixtures/medium
./bench/memory.sh --fixture-dir ./bench/fixtures/medium
```

The scripts print a summary table to stdout. The same data is appended to `results.md` with a timestamp.

## What this is not

- **Not a comparison to Rspack/Webpack.** Running Rspack on the same fixtures is a separate project, and we are not maintaining a fork. If you want to compare, install Rspack separately and adapt the harness.
- **Not a micro-benchmark.** The harness builds entire projects. For per-loader or per-graph benchmarks, write a custom Rust test.
- **Not a load test.** A single `srspack build` invocation is one observation. For statistical significance, run `./bench/cold-build.sh --iterations 30` and look at the median.

## Adding a fixture

1. Create a directory under `bench/fixtures/<name>/`.
2. Add an `app/` directory with `page.tsx`, `layout.tsx`, and `global.css`.
3. Add a `package.json` with `"name": "<name>-fixture"`.
4. Run `./bench/cold-build.sh --fixture-dir ./bench/fixtures/<name>` to record the first observation.
