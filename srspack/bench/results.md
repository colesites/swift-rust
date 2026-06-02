# srspack benchmark results

This file is updated by the bench harness. The first table is populated by the first run after `cargo build --release`.

## Cold build

| Fixture | Iterations | Min (ms) | Median (ms) | Max (ms) | OS | Date |
|---|---|---|---|---|---|---|
| small  (50 modules,  9 public)  | 3 | 51.25 | 56.13 | 61.84 | macos x86_64 | 2026-06-02 |
| medium (500 modules,  36 public) | 3 | 94.07 | 96.13 | 105.60 | macos x86_64 | 2026-06-02 |
| large  (5000 modules, 131 public) | 2 | 453.54 | 472.35 | 491.16 | macos x86_64 | 2026-06-02 |

## Incremental build (single file touch)

| Fixture | Iterations | Min (ms) | Median (ms) | Max (ms) | OS | Date |
|---|---|---|---|---|---|---|
| small  (50 modules,  9 public)  | 10 | 37.92 | 39.57 | 64.54 | macos x86_64 | 2026-06-02 |
| medium (500 modules,  36 public) | 10 | 70.11 | 72.20 | 119.94 | macos x86_64 | 2026-06-02 |

## Peak memory (cold build)

| Fixture | Iterations | Max RSS (MB) | Sampler | OS | Date |
|---|---|---|---|---|---|
| small  (50 modules,  9 public)  | 2 | 0.74 | ps-sampled | macos x86_64 | 2026-06-02 |
| medium (500 modules,  36 public) | 2 | 0.73 | ps-sampled | macos x86_64 | 2026-06-02 |
| large  (5000 modules, 131 public) | 2 | 0.72 | ps-sampled | macos x86_64 | 2026-06-02 |

> Memory sampler is `ps -o rss=` polled at 100 Hz. Install `gnu-time` (`brew install gnu-time`) for `Maximum resident set size` from `/usr/bin/time -v`.

## Per-stage profile (`srspack build --profile`)

`srspack build --mode production --out ./dist --profile` prints a breakdown of
where the wall time goes. The table below is from the medium fixture (cold,
first run) on the same machine.

```
stage            time (ms)  bytes in   bytes out
---------------  ---------  ---------  ----------
walk                 81.93          0           0
bundle                0.12          0           0
record_assets         0.00          0           0
compress             50.98    1047166      171369
---------------  ---------  ---------  ----------
total               133.13
```

Same shape on every size: **walk + compress are the only non-zero stages**.
The bundler is still a stub (`bundle`, `record_assets` ≈ 0). Walk is dominated
by syscall overhead and `read_to_string` on text files; compress is parallel
over all public/ files with rayon, so its wall time is roughly
`bytes / (n_threads × bytes_per_ms_per_thread)`.

### What we win by parallelization

| Stage    | Serial  | Parallel (rayon, 8 cores) | Speedup |
|----------|---------|---------------------------|---------|
| compress (medium) | 484 ms | 51 ms | 9.5× |
| compress (large)  | 1366 ms | 211 ms | 6.5× |

### What walk costs

`walk` scales linearly with file count:

| Fixture | Files walked | walk (ms) | per-file |
|---|---|---|---|
| small  | 63  | 25  | 0.40 ms |
| medium | 549 | 82  | 0.15 ms |
| large  | 5233 | 728 | 0.14 ms |

The large-fixture walk is dominated by `read_to_string` for ~5000 text files.
The next optimization here is `mmap` (avoids a copy into a `String`) or a
parallel walk; both are queued for Phase 4.

## Methodology

- **Hardware**: whatever the runner is on. We do not normalize.
- **OS**: whatever the runner is on. Linux x86_64, macOS arm64, macOS x86_64 are all valid; we report the OS in the row.
- **Build**: `cargo build --release` with the workspace `Cargo.toml` `release` profile (`lto = "thin"`, `codegen-units = 1`).
- **Cache**: `.srspack-cache` is deleted before each cold-build run; left intact for incremental runs.
- **Output**: `dist/` is deleted before each cold-build run; left intact for incremental runs.
- **Cold build**: 5 iterations on small/medium, 3 on large.
- **Incremental build**: 10 iterations; the script default is 20.
- **Memory**: 2 iterations; we take the max of the run maxes.

## Reading the table

Cold build is the time to bundle the fixture from scratch. Incremental is the time to rebuild after touching one file. Memory is the peak resident set size during a cold build.

A reasonable comparison point is the median of 5 cold-build runs and 20 incremental runs on the same hardware. Anything below 10% of Rspack's published numbers (on the same hardware) is a pass; above 20% is a regression; in between is a measurement artifact we should investigate.

## Caveats

These numbers measure the **srspack wrapper harness**, not the real bundler. `crates/bundler` is currently a scaffold stub that returns `Ok(BundleOutput::default())` immediately, so the timing is dominated by:

1. Process startup (~5–10 ms).
2. The `walkdir` traversal of `app/` and `public/`.
3. `read_to_string` on every text file.
4. `image` decode + JPEG/WebP re-encode and `brotli` compress on every public/ file.

Compression runs on every cold build because the bench script wipes `.srspack-cache` between runs. A future phase will persist the compress manifest to disk so a re-run on unchanged sources is a no-op; expect cold → warm cold-build numbers to converge.
