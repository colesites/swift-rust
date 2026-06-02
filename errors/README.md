# Errors

The `errors/` directory at the repository root holds the canonical documentation for every error code the Swift-Rust framework can produce. Each file is named after the code (e.g. `SR0001.md`) and lives under `errors/docs/`.

The `Error` enum lives in `crates/errors/src/lib.rs`. The CI check in `errors/sync.mjs` verifies that the docs and the enum stay in sync.

## Layout

```
errors/
├── README.md            # this file
├── schema.json          # JSON schema describing the frontmatter of each doc
├── docs/
│   ├── SR0001.md
│   ├── SR0002.md
│   └── ...
├── _mapping.json        # internal: Next.js error → SR code crosswalk
└── sync.mjs             # script: verify docs <-> enum parity
```

## File format

Each `errors/docs/SR####.md` file has two parts: a YAML frontmatter block (machine-readable) and a markdown body (human-readable).

### Frontmatter (must validate against `schema.json`)

```yaml
code: SR0001              # stable identifier
title: "Configuration error"
summary: "One-line description of when this occurs."
category: config          # see "Categories" below
severity: error           # error | warning | deprecation | info
since: 0.1.0              # version that introduced the code
causes:                   # 1-5 bullets, root causes
  - "..."
  - "..."
fixes:                    # 1-5 bullets, remediation steps
  - "..."
related:                  # 0-5 codes, cross-references
  - SR0002
```

### Body sections (in order)

1. `# SR#### — Title` — one paragraph: what triggers this and why
2. `## Why this error occurred` — 2-4 paragraphs of conceptual explanation
3. `## Reproducing the error` — minimal bad code (tsx/typescript code block)
4. `## Error output` — what the user actually sees (code block with `[SR####]`)
5. `## How to fix it` — numbered steps + good code
6. `## Diagnosis` — CLI commands (`bun swift-rust doctor`, `RUST_LOG=swift_rust=trace`, etc.)
7. `## Common pitfalls` — gotchas, version notes, browser quirks
8. `## See also` — cross-references to other SR codes
9. `## Useful links` — external references (optional)

## Categories

| Category     | Range             | Description                                                  |
| ------------ | ----------------- | ------------------------------------------------------------ |
| `config`     | SR0001–SR0049     | Configuration, project root, env, build id, alias, scripts.  |
| `server`     | SR0050–SR0099     | HTTP server, middleware/proxy, route handlers, request flow. |
| `bundling`   | SR0100–SR0149     | Bundler, build pipeline, postcss, sass, esm, swc output.     |
| `image`      | SR0150–SR0199     | Image component, sharp, host patterns, qualities.            |
| `font`       | (inside SR0150+)  | Font component, Google Fonts, subsets, preconnect.           |
| `pdf`        | (inside SR0150+)  | PDF component (reserved).                                    |
| `style`      | (inside SR0150+)  | CSS, modules, sass, postcss, no-css-tags.                    |
| `hydration`  | (inside SR0150+)  | React hydration mismatches, suspense, server vs client tree. |
| `runtime`    | SR0200–SR0249     | Client runtime, hooks, classes, links, refs, thrown errors.  |
| `tooling`    | SR0250–SR0299     | CLI, doctor, multi-tabs, fast refresh, opening issues.       |

> The range boundaries are a guideline, not a hard rule. The mapping in `_mapping.json` is the source of truth.

## Code numbering

Codes are assigned sequentially per `errors/_mapping.json`. When you add a new code, append to the highest existing number. Gaps are not allowed; renumbering breaks every published link.

## Adding a new error code

1. Pick the next free `SR####` (see `_mapping.json` for the highest used).
2. Create `errors/docs/SR####.md` following the file format above.
3. Add the matching variant to `crates/errors/src/lib.rs`.
4. Update `_mapping.json` with the slug, code, category, and severity.
5. Run `bun errors/sync.mjs` to confirm parity.
6. Open a PR with a changeset.

## CI

`bun errors/sync.mjs` runs in CI on every PR. It fails if:

- A file in `errors/docs/` is missing the frontmatter
- A `code:` in the frontmatter doesn't match the filename
- A `category:` is not in the allowed enum
- A `severity:` is not in the allowed enum
- A `related:` code doesn't correspond to a real file

## Origin

The first 150 codes (`SR0001`–`SR0150`) were ported from the [Next.js errors directory](https://github.com/vercel/next.js/tree/canary/errors) with each error adapted to Swift-Rust's terminology and augmented with five additional body sections (repro, error output, diagnosis, common pitfalls, see also). See `_mapping.json` for the crosswalk and the per-entry skip reasons.
