---
title: Why srspack
---

# Why srspack

Every modern web framework ends up needing a bundler. Swift-Rust is no exception — but we deliberately did **not** adopt Rspack, Webpack, esbuild, or Turbopack. We wrote srspack.

## The thesis

A bundler that lives inside a framework should:

1. **Share a process with the framework.** A child-process bundler pays for IPC on every dev request. srspack runs in the same process as the Swift-Rust dev server.
2. **Share a compiler with the framework.** A bundler that hands off to a JS plugin bridge or a JSON manifest bridge pays for serialization on every module. srspack hands TypeScript and JSX directly to the Swift-Rust compiler in the same `cargo` workspace.
3. **Use a single graph.** Rspack has separate module and chunk graphs that are reconciled each pass. srspack maintains one DAG: modules, chunks, and assets are the same kind of node, with the same hash, looked up the same way.
4. **Cache by content, not by path.** A change to `node_modules/foo/index.js` line 47 is a different cache hit from line 48. Path-based caching (Rspack's default) conflates them. srspack keys the cache on blake3 of the source bytes.
5. **Have a small public surface.** Rspack's config surface is webpack-compatible, which is a synonym for "very large." srspack's config is six fields.

## The trade-offs

We accept the cost of maintaining a bundler in exchange for:

- **No JS plugin layer at runtime.** Plugins are compiled into the binary.
- **Smaller community of pre-built loaders.** We ship the ones Swift-Rust needs: TSX, CSS Modules. Other transforms can be added as Rust crates.
- **Less portable.** srspack is a Swift-Rust component. If you leave the framework, the bundler comes with you.

We do not accept the cost of writing a generic JavaScript bundler. That market has four credible entrants and a half-dozen pretenders. The bundler for Swift-Rust is the bundler for Swift-Rust.

## What this is not

- **Not a Rspack fork.** We took no code from Rspack. The architectural name overlap (single graph, Rust) is convergent, not derived.
- **Not a Turbopack clone.** Turbopack is Vercel's bundler. The shared idea — "the bundler is part of the framework" — is what we copied. The implementation is independent.
- **Not a webpack replacement.** webpack's plugin model is a feature for projects that need to extend the bundler at runtime. Swift-Rust projects extend the bundler by adding a Rust crate.

## When to use srspack directly

Most Swift-Rust users will never invoke `srspack build` themselves. The framework runs srspack on `swift-rust dev` and `swift-rust build` and handles the output. If you are:

- writing a Swift-Rust plugin that needs to inspect the bundle,
- authoring a custom loader as a Rust crate,
- benchmarking bundler changes,
- integrating Swift-Rust into a larger build pipeline,

then you are the audience for the srspack CLI and library. Everyone else can ignore the directory.
