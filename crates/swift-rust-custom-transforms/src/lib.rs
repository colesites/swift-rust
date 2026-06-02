//! Custom SWC transforms for swift-rust.
//!
//! These are AST-level rewrites that happen *after* parsing and *before*
//! code generation. They're useful for framework-specific concerns that
//! TypeScript and standard JSX don't have a story for.
//!
//! The actual SWC integration lives in the separate `swift-rust-error-code-swc-plugin`
//! crate (which has its own sub-workspace because `swc_core` has strict
//! version requirements). This crate documents the transform contracts
//! and exposes them as a Rust API for non-WASM consumers.

use std::collections::BTreeSet;

#[derive(Debug, thiserror::Error)]
pub enum TransformError {
    #[error("invalid syntax: {0}")]
    InvalidSyntax(String),

    #[error("transform rejected: {0}")]
    Rejected(String),
}

pub type Result<T> = std::result::Result<T, TransformError>;

#[derive(Clone)]
pub struct Transform {
    pub name: String,
    pub description: String,
    pub run: TransformFn,
}

pub type TransformFn = fn(&mut SourceUnit) -> Result<()>;

#[derive(Debug, Clone, Default)]
pub struct SourceUnit {
    pub path: String,
    pub source: String,
    pub imports: BTreeSet<String>,
    pub server_only: bool,
    pub client_only: bool,
}

impl SourceUnit {
    pub fn new(path: impl Into<String>, source: impl Into<String>) -> Self {
        Self {
            path: path.into(),
            source: source.into(),
            imports: BTreeSet::new(),
            server_only: false,
            client_only: false,
        }
    }
}

/// Strip "use client" and "use server" directives into structured state.
pub fn strip_directive_directive(unit: &mut SourceUnit) -> Result<()> {
    for line in unit.source.lines() {
        let trimmed = line.trim();
        if trimmed == "\"use client\";" || trimmed == "'use client';" {
            unit.client_only = true;
        } else if trimmed == "\"use server\";" || trimmed == "'use server';" {
            unit.server_only = true;
        }
    }
    Ok(())
}

/// Collect every imported module path so the bundler can pre-resolve.
pub fn collect_imports(unit: &mut SourceUnit) -> Result<()> {
    for line in unit.source.lines() {
        let trimmed = line.trim_start();
        if !trimmed.starts_with("import ") && !trimmed.contains("import ") {
            continue;
        }
        let after_from = if let Some(idx) = trimmed.find("from ") {
            &trimmed[idx + 5..]
        } else {
            continue;
        };
        let rest = after_from.trim_start();
        let bytes = rest.as_bytes();
        if bytes.is_empty() {
            continue;
        }
        let quote = bytes[0];
        if quote != b'\'' && quote != b'"' {
            continue;
        }
        let rest_after = &rest[1..];
        if let Some(close) = rest_after.find(quote as char) {
            let spec = &rest_after[..close];
            if !spec.is_empty() {
                unit.imports.insert(spec.to_string());
            }
        }
    }
    Ok(())
}

pub fn server_only_assertion(_unit: &mut SourceUnit) -> Result<()> {
    Ok(())
}

pub fn noop(_unit: &mut SourceUnit) -> Result<()> {
    Ok(())
}

pub fn standard_pipeline() -> Vec<Transform> {
    vec![
        Transform {
            name: "strip-directive".to_string(),
            description: "Recognize \"use client\" / \"use server\" directives".to_string(),
            run: strip_directive_directive,
        },
        Transform {
            name: "collect-imports".to_string(),
            description: "Collect all module specifiers for the bundler".to_string(),
            run: collect_imports,
        },
        Transform {
            name: "noop".to_string(),
            description: "Pass-through".to_string(),
            run: noop,
        },
    ]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn recognizes_use_client() {
        let mut u = SourceUnit::new("x.tsx", "\"use client\";\nimport React from 'react';");
        strip_directive_directive(&mut u).unwrap();
        assert!(u.client_only);
        assert!(!u.server_only);
    }

    #[test]
    fn collects_imports() {
        let mut u = SourceUnit::new(
            "x.tsx",
            "import a from 'react';\nimport { b } from 'swift-rust/router';\n",
        );
        collect_imports(&mut u).unwrap();
        assert!(u.imports.contains("react"));
        assert!(u.imports.contains("swift-rust/router"));
    }
}
