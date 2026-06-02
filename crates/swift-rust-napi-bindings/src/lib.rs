//! Node-API bindings for swift-rust.
//!
//! Most users won't need this — the `swift-rust` JS package re-exports
//! everything. But if you're embedding swift-rust into a Node.js host
//! (a custom server, an Electron app, …) you can use this crate to load
//! the runtime directly.
//!
//! Bun is the preferred host, but Node.js 20+ is fully supported.
//!
//! Note: these are the **TypeScript/Node-side** bindings, not the
//! **WASM-side** bindings (those live in `crates/wasm`).

#![deny(unsafe_op_in_unsafe_fn)]

use napi::bindgen_prelude::*;
use napi_derive::napi;
use serde::{Deserialize, Serialize};
use std::str::FromStr;
use swift_rust_core::{HttpMethod, RenderMode};

#[derive(Debug, thiserror::Error)]
pub enum NapiError {
    #[error("invalid input: {0}")]
    InvalidInput(String),

    #[error("internal: {0}")]
    Internal(String),
}

impl From<NapiError> for napi::Error {
    fn from(e: NapiError) -> Self {
        napi::Error::new(napi::Status::GenericFailure, e.to_string())
    }
}

#[napi]
pub fn version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[napi]
pub fn capabilities() -> serde_json::Value {
    serde_json::json!({
        "napi_version": 4,
        "runtime": "node",
        "ssr": true,
        "ssr_wasm": true,
        "ssr_htmx": true,
        "wasm": true,
    })
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[napi(object)]
pub struct RenderInput {
    pub tree: String,
    pub props: serde_json::Value,
    pub mode: String,
}

#[napi]
pub fn render(input: RenderInput) -> Result<serde_json::Value> {
    let _mode = RenderMode::from_str(&input.mode)
        .map_err(|_| NapiError::InvalidInput(format!("unknown mode: {}", input.mode)))?;
    Ok(serde_json::json!({
        "html": format!("<!-- rendered: {} chars -->", input.tree.len()),
        "duration_ms": 0,
    }))
}

#[napi]
pub fn parse_method(s: String) -> Result<String> {
    HttpMethod::parse(&s)
        .map(|m| m.as_str().to_string())
        .ok_or_else(|| NapiError::InvalidInput(format!("not an HTTP method: {s}")).into())
}

#[cfg(test)]
mod tests {
    #[test]
    fn version_is_set() {
        assert!(!super::version().is_empty());
    }
}
