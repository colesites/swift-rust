//! SWC plugin that injects error codes into compiled output.
//!
//! At compile time, every call to `notFound()` or `redirect()` is replaced
//! with a thunk that carries a stable error code (e.g. `SR-E1404`). At
//! runtime, the framework can look up that code in a small table to render
//! the right error page, log the right telemetry, and so on.
//!
//! The actual SWC integration requires `swc_core` which has pinned
//! dependencies that don't work in the root workspace. The real plugin
//! lives in `crates/compiler/` (separate sub-workspace). This crate is the
//! stable contract.

use std::collections::BTreeMap;

#[derive(Debug, thiserror::Error)]
pub enum PluginError {
    #[error("unknown error code: {0}")]
    UnknownCode(String),
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum ErrorCode {
    NotFound,
    Redirect,
    CompileError,
    HydrationMismatch,
    NetworkError,
    ServerError,
}

impl ErrorCode {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::NotFound => "SR-E1404",
            Self::Redirect => "SR-E1301",
            Self::CompileError => "SR-E0001",
            Self::HydrationMismatch => "SR-E0501",
            Self::NetworkError => "SR-E0901",
            Self::ServerError => "SR-E0002",
        }
    }

    pub fn lookup(code: &str) -> Option<Self> {
        match code {
            "SR-E1404" => Some(Self::NotFound),
            "SR-E1301" => Some(Self::Redirect),
            "SR-E0001" => Some(Self::CompileError),
            "SR-E0501" => Some(Self::HydrationMismatch),
            "SR-E0901" => Some(Self::NetworkError),
            "SR-E0002" => Some(Self::ServerError),
            _ => None,
        }
    }
}

#[derive(Debug, Clone, Default)]
pub struct CodeRegistry {
    by_call_site: BTreeMap<String, ErrorCode>,
}

impl CodeRegistry {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn register(&mut self, call_site: impl Into<String>, code: ErrorCode) {
        self.by_call_site.insert(call_site.into(), code);
    }

    pub fn lookup(&self, call_site: &str) -> Option<ErrorCode> {
        self.by_call_site.get(call_site).copied()
    }

    pub fn known_codes() -> &'static [ErrorCode] {
        &[
            ErrorCode::NotFound,
            ErrorCode::Redirect,
            ErrorCode::CompileError,
            ErrorCode::HydrationMismatch,
            ErrorCode::NetworkError,
            ErrorCode::ServerError,
        ]
    }
}

pub fn annotate_source(source: &str, registry: &CodeRegistry) -> String {
    let mut out = String::with_capacity(source.len() + 64);
    for (i, line) in source.lines().enumerate() {
        let site = format!("{i}:{line}");
        if let Some(code) = registry.lookup(&site) {
            out.push_str(&format!("/* {} */ {}\n", code.as_str(), line));
        } else {
            out.push_str(line);
            out.push('\n');
        }
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn codes_roundtrip() {
        for c in CodeRegistry::known_codes() {
            assert_eq!(ErrorCode::lookup(c.as_str()), Some(*c));
        }
    }

    #[test]
    fn annotate_inserts_marker() {
        let mut r = CodeRegistry::new();
        r.register("0:throw new NotFoundError();", ErrorCode::NotFound);
        let src = "throw new NotFoundError();\nthrow new Error('x');";
        let out = annotate_source(src, &r);
        assert!(out.contains("SR-E1404"));
    }
}
