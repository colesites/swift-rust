---
"@swift-rust/srspack": minor
---

srspack now compresses everything in your `public/` directory automatically as
part of `srspack build`. No new config; no new command. The original files are
left in place; the optimized siblings are what `<Image>`, `<Video>`, the font
loader, and the runtime negotiator pick first.

**What gets compressed**

| Kind   | Source exts                                  | Output                          |
|--------|----------------------------------------------|---------------------------------|
| image  | png, jpg, jpeg, gif, webp, tiff, tif        | re-encoded JPEG q=80 (no alpha) or lossless WebP (alpha), `.opt.jpg`/`.opt.webp` |
| text   | html, css, js, mjs, json, xml, svg, txt, md | brotli q=11 sidecar, `.<name>.txt.br` |
| pass   | everything else                              | copied verbatim                  |

**Typical savings on a sample fixture** (macOS x86_64, 100 PNGs + 30 CSS files,
~4 MB total source):

- source bytes: 4,009,815
- optimized bytes: 682,949
- savings: 82.97%

**Profiler**

`srspack build --profile` now prints a per-stage breakdown of where wall time
goes (`walk`, `bundle`, `record_assets`, `compress`, `total`, with bytes
in/out per stage). Use it to find the slow stage on your real fixture; the
bench harness's `cold-build.sh` does not pass `--profile` by default because
we want clean wall-time numbers for the cold-build table.

**Performance** (medium fixture, macOS x86_64, release build)

- before parallelization: 736 ms cold
- after parallelization (rayon, 8 cores): 96 ms cold
- same fixture, no compress: 76 ms (compress adds ~20 ms of overhead at this size)

The cost is mostly in `image` decode + JPEG encode, which is single-file
serial within each rayon's worker. A future phase will add a
`compress-manifest.json` to `.srspack-cache/` so re-builds on unchanged
sources are a no-op.

**Other changes**

- `walkdir` no longer calls `read_to_string` on binary files (only files that
  have a registered loader get the read; everything else is recorded as a
  zero-byte source). This shaves ~30% off the walk stage on a fixture with a
  populated `public/`.
- `srspack build` exposes a new `build_with_profile(root, opts, &mut Profile)`
  entry point on `Srspack` for library consumers that want per-stage numbers
  without parsing the CLI's `--profile` output.
- `crates/srspack-core` now has an `Error::Compress(String)` variant.
