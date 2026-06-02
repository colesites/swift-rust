---
title: Performance
---

# Performance

We publish the harness, the methodology, and the numbers. Numbers we have not measured are marked **projected**. Numbers we have are marked **measured**.

## What we measure

Three workloads, run on a fixed fixture set under `bench/fixtures/`:

1. **Cold build** — `rm -rf .srspack-cache dist && time srspack build`
2. **Incremental** — touch one file, `time srspack build`, repeat N times
3. **Memory** — peak RSS across a single build, measured with `/usr/bin/time -v`

The harness is `bench/cold-build.sh`, `bench/incremental.sh`, `bench/memory.sh`. Results land in `bench/results.md` after a run.

## Projections (not yet measured)

The numbers below are architectural projections. They are the values we expect the harness to confirm, modulo measurement noise. They are not promises.

| Workload | srspack (projected) | Rspack 1.x (observed, public benches) |
|---|---|---|
| Cold build, 1000 modules | ~0.4 s | ~1.2 s |
| Cold build, 10 000 modules | ~4 s | ~14 s |
| HMR, single module edit | ~12 ms | ~50 ms |
| Peak memory, 10 000 modules | ~600 MB | ~1.4 GB |

The reasons we expect to land near these numbers:

- **No JSON manifest IPC.** A representative Rspack build passes each module's metadata through a JS-side object, which is JSON-serialized for the bundler to read back. We never do that; the bundler and the framework hold the same Rust types.
- **No plugin bridge.** Rspack's plugin API is a JS function called from Rust, paying an FFI hop. We do not have a plugin API at runtime; transforms are Rust crates.
- **Lock-free cache reads.** `parking_lot::RwLock` is non-fair, non-blocking on read. Rspack's JS-side cache uses a single-threaded event loop.
- **Single graph.** Reconciling a module graph and a chunk graph is O(modules × chunks) per pass. We pay it once.

## Caveats

- The 10 000-module projection assumes a fixture that exercises the cache, the TSX loader, and the CSS loader. A pure-JS 10 000-module benchmark would be lower for both bundlers.
- The HMR number assumes a content-hashed cache miss on exactly one file. A miss on a file that 200 other modules import is closer to 60 ms even on srspack, because the loader pipeline still runs.
- Memory numbers depend on `parking_lot` not retaining the entire module map across the build. We have not validated this in a real run.

## Why we don't publish numbers we don't have

A "100% better than Next.js" framework cannot afford to ship a benchmark page full of projected numbers presented as measured. The honest version of this page is what you are reading: a methodology, a harness, and projections clearly marked as such. The next release of srspack will run the harness and replace the projected column with measured numbers.

## Reproducing

```bash
cd srspack
./scripts/build.sh
cd ..
./bench/cold-build.sh
./bench/incremental.sh
./bench/memory.sh
```

`bench/results.md` is updated by the harness with the new numbers and a timestamp.
