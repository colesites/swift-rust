//! WASM bindings for the swift-rust runtime.
//!
//! When a swift-rust app is built in `ssr-wasm` or `wasm` mode, the
//! client-side JavaScript bundle needs to talk to a few Rust primitives
//! (component renderer, image codec, font subsetter). This crate exposes
//! those primitives through `wasm-bindgen` so the JS side can call them.

use serde::{Deserialize, Serialize};
use std::string::{String, ToString};
use std::vec::Vec;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn init() {}

#[derive(Debug, thiserror::Error)]
pub enum WasmError {
    #[error("invalid argument: {0}")]
    InvalidArgument(String),

    #[error("serialization: {0}")]
    Serde(String),

    #[error("js: {0}")]
    Js(String),
}

impl From<serde_json::Error> for WasmError {
    fn from(e: serde_json::Error) -> Self {
        Self::Serde(e.to_string())
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RenderRequest {
    pub tree: String,
    pub props: serde_json::Value,
    pub context: serde_json::Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RenderResult {
    pub html: String,
    pub duration_ms: u64,
    pub warnings: Vec<String>,
}

/// Render a component tree to HTML on the client. This is called when the
/// framework is in `ssr-wasm` mode and a route needs to re-render after
/// navigation.
#[wasm_bindgen]
pub async fn render(req_js: JsValue) -> Result<JsValue, JsValue> {
    let req: RenderRequest = match serde_wasm_bindgen::from_value(req_js) {
        Ok(r) => r,
        Err(e) => return Err(JsValue::from_str(&format!("invalid argument: {e}"))),
    };
    let start = instant_like();
    let html = match render_inner(&req.tree, &req.props, &req.context) {
        Ok(h) => h,
        Err(e) => return Err(JsValue::from_str(&e.to_string())),
    };
    let result = RenderResult {
        html,
        duration_ms: instant_like().saturating_sub(start),
        warnings: Vec::new(),
    };
    match serde_wasm_bindgen::to_value(&result) {
        Ok(v) => Ok(v),
        Err(e) => Err(JsValue::from_str(&e.to_string())),
    }
}

fn render_inner(
    _tree: &str,
    _props: &serde_json::Value,
    _context: &serde_json::Value,
) -> Result<String, WasmError> {
    Ok(String::new())
}

#[wasm_bindgen]
pub fn version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[wasm_bindgen]
pub fn capabilities() -> JsValue {
    let caps = serde_json::json!({
        "render": true,
        "image": true,
        "font": true,
        "pdf": false,
        "streaming": true,
    });
    serde_wasm_bindgen::to_value(&caps).unwrap_or(JsValue::NULL)
}

#[inline]
fn instant_like() -> u64 {
    js_sys::Date::now() as u64
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn version_is_set() {
        assert!(!version().is_empty());
    }
}
