# `swift-rust-custom-transforms`

Custom AST-level transforms that augment the standard SWC pipeline.

## Why

TypeScript and JSX don't have first-class syntax for things like
`"use client"` directives, server-only imports, or framework-specific
metadata. These transforms run *after* parsing and *before* code
generation, giving us a clean place to handle them.

## The SWC plugin itself

Lives in `swift-rust-error-code-swc-plugin/` (separate sub-workspace
because `swc_core` has pinned-version requirements). This crate is the
documented Rust API for non-WASM consumers and is the test bed for new
transforms.
