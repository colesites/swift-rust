# `swift-rust-code-frame`

Source code frame extraction for fast, beautiful error messages.

## What it does

Given a source file, a line, and a column, it produces a human-readable
"code frame" like Rust's `rustc`:

```
 1 │ export function hello() {
   │                        ^
 2 │   console.log("hi")
 3 │ }
```

## Renderers

- `render_plain` — terminal-friendly plain text
- `render_ansi` — ANSI-colored terminal output
- `render_html` — HTML for web error overlays

## Why

The `error` crate's diagnostic engine uses this. The dev server's overlay
uses this. The CLI's `swift-rust info <file>` uses this. We extracted it
because every consumer wants the same exact output.
