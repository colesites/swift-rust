---
title: Loaders
---

# Loaders

A loader is a Rust crate that implements the `Loader` trait from `srspack-core`. Loaders transform a module's source bytes into the form srspack should bundle. The Swift-Rust framework ships with two loaders; third parties can publish more.

## The `Loader` trait

```rust
#[async_trait::async_trait]
pub trait Loader: Send + Sync {
    fn name(&self) -> &'static str;
    fn test(&self, path: &Path) -> bool;
    async fn transform(
        &self,
        ctx: LoaderContext,
    ) -> Result<LoaderOutput, Box<dyn std::error::Error + Send + Sync>>;
}
```

- `name` returns a short identifier (`"tsx"`, `"css"`). Used for diagnostics and cache keys.
- `test` is a fast check that decides whether this loader applies to a file. It is called for every file in the project; keep it O(1).
- `transform` does the work. It receives a `LoaderContext` (path, source, module id) and returns a `LoaderOutput` (transformed code, optional sourcemap, cacheable flag).

## Built-in loaders

| Loader | Extensions | Source |
|---|---|---|
| `tsx` | `.tsx`, `.jsx` | `crates/srspack-loader-tsx/src/lib.rs` |
| `css` | `.css`, `.module.css`, `.scss`, `.sass`, `.less` | `crates/srspack-loader-css/src/lib.rs` |

## Authoring a loader

A loader crate looks like:

```toml
# srspack-loader-foo/Cargo.toml
[package]
name = "srspack-loader-foo"
version = "0.1.0"
edition = "2021"

[dependencies]
srspack-core = { path = "../srspack-core" }
async-trait = "0.1"
```

```rust
// srspack-loader-foo/src/lib.rs
use std::path::Path;
use async_trait::async_trait;
use srspack_core::loader::{Loader, LoaderContext, LoaderOutput};

pub struct FooLoader;

#[async_trait]
impl Loader for FooLoader {
    fn name(&self) -> &'static str { "foo" }
    fn test(&self, path: &Path) -> bool {
        path.extension().and_then(|e| e.to_str()) == Some("foo")
    }
    async fn transform(
        &self,
        ctx: LoaderContext,
    ) -> Result<LoaderOutput, Box<dyn std::error::Error + Send + Sync>> {
        Ok(LoaderOutput::new(ctx.module_id, transform(&ctx.source)?))
    }
}

fn transform(src: &str) -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
    // do the work
    Ok(src.to_string())
}
```

Register the loader with the bundler:

```rust
let srspack = Srspack::new();
srspack.register_loader(Box::new(FooLoader));
```

The loader is then selected automatically for any file whose extension matches `test()`.

## Caching

A loader's output is cached by content hash. A loader that returns `cacheable: true` (the default) will not be re-invoked for the same source on a subsequent build. Set `cacheable: false` for loaders whose output is not deterministic (e.g. a loader that reads `process::time()` or `std::env`).

## Errors

A loader that fails should return an error with a message that includes the file path and the line number if possible. srspack wraps the error in a `BundleError::Loader` and prints it to the console with the file path and the loader name. The build is aborted at that point; partial outputs are not written.
