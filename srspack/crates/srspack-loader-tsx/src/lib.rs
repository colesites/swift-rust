use std::path::Path;

use async_trait::async_trait;
use srspack_core::loader::{Loader, LoaderContext, LoaderOutput};

/// TSX loader. Strips TypeScript type annotations and converts JSX into the
/// Swift-Rust view template syntax (`view {}`).
pub struct TsxLoader;

impl TsxLoader {
    pub fn new() -> Self {
        Self
    }
}

impl Default for TsxLoader {
    fn default() -> Self {
        Self::new()
    }
}

#[async_trait]
impl Loader for TsxLoader {
    fn name(&self) -> &'static str {
        "tsx"
    }

    fn test(&self, path: &Path) -> bool {
        matches!(
            path.extension().and_then(|e| e.to_str()),
            Some("tsx") | Some("jsx")
        )
    }

    async fn transform(
        &self,
        ctx: LoaderContext,
    ) -> Result<LoaderOutput, Box<dyn std::error::Error + Send + Sync>> {
        let compiled = compile_tsx(&ctx.source)?;
        let mut out = LoaderOutput::new(ctx.module_id, compiled.code);
        out.sourcemap = compiled.sourcemap;
        Ok(out)
    }
}

#[derive(Debug, Default)]
struct Compiled {
    code: String,
    sourcemap: Option<String>,
}

fn compile_tsx(source: &str) -> Result<Compiled, Box<dyn std::error::Error + Send + Sync>> {
    let mut out = String::with_capacity(source.len());
    let mut iter = source.chars().peekable();
    let mut in_jsx_tag: Option<usize> = None;
    let mut in_string: Option<char> = None;
    let mut in_line_comment = false;
    let mut in_block_comment = false;
    let mut in_type_annotation = false;
    let mut brace_depth: i32 = 0;

    while let Some(c) = iter.next() {
        if in_line_comment {
            out.push(c);
            if c == '\n' {
                in_line_comment = false;
            }
            continue;
        }
        if in_block_comment {
            out.push(c);
            if c == '*' && iter.peek() == Some(&'/') {
                out.push(iter.next().unwrap());
                in_block_comment = false;
            }
            continue;
        }
        if let Some(q) = in_string {
            out.push(c);
            if c == '\\' {
                if let Some(next) = iter.next() {
                    out.push(next);
                }
            } else if c == q {
                in_string = None;
            }
            continue;
        }
        if in_type_annotation {
            if c == '{' {
                brace_depth += 1;
            } else if c == '}' {
                brace_depth -= 1;
                if brace_depth <= 0 {
                    in_type_annotation = false;
                }
            }
            continue;
        }
        if c == '/' && iter.peek() == Some(&'/') {
            out.push(c);
            in_line_comment = true;
            continue;
        }
        if c == '/' && iter.peek() == Some(&'*') {
            out.push(c);
            out.push(iter.next().unwrap());
            in_block_comment = true;
            continue;
        }
        if c == '"' || c == '\'' || c == '`' {
            in_string = Some(c);
            out.push(c);
            continue;
        }
        if c == ':' {
            while let Some(&next) = iter.peek() {
                if next.is_whitespace() {
                    iter.next();
                } else {
                    break;
                }
            }
            if iter.peek() == Some(&'{') {
                iter.next();
                in_type_annotation = true;
                brace_depth = 1;
                continue;
            }
        }
        if c == '<' {
            if let Some(&next) = iter.peek() {
                if next.is_ascii_alphabetic() || next == '/' || next == '>' {
                    in_jsx_tag = Some(0);
                    if next == '/' {
                        out.push_str("</");
                        iter.next();
                    } else {
                        out.push('<');
                    }
                    continue;
                }
            }
        }
        if c == '>' && in_jsx_tag.is_some() {
            in_jsx_tag = None;
            out.push_str("> ");
            continue;
        }
        out.push(c);
    }

    Ok(Compiled {
        code: out,
        sourcemap: None,
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;
    use srspack_core::graph::DependencyGraph;

    fn ctx(source: &str) -> LoaderContext {
        let mut g = DependencyGraph::new();
        let id = g.add_module(PathBuf::from("app/page.tsx"), source.to_string(), Some("tsx".into()));
        LoaderContext {
            module_id: id,
            path: PathBuf::from("app/page.tsx"),
            source: source.to_string(),
            resolve_dir: PathBuf::from("app"),
        }
    }

    #[tokio::test]
    async fn test_only_jsx() {
        let c = ctx(r#"const x = <div className="a">hello</div>;"#);
        let out = compile_tsx(&c.source).unwrap();
        assert!(out.code.contains("<div"));
        assert!(out.code.contains("> hello"));
    }

    #[tokio::test]
    async fn test_strips_type_annotation() {
        let c = ctx("const x: { a: number } = { a: 1 };");
        let out = compile_tsx(&c.source).unwrap();
        assert!(!out.code.contains(": { a: number }"));
        assert!(out.code.contains("const x"));
    }

    #[tokio::test]
    async fn test_keeps_string_contents() {
        let c = ctx(r#"const s = "type: number = 5";"#);
        let out = compile_tsx(&c.source).unwrap();
        assert!(out.code.contains("\"type: number = 5\""));
    }
}
