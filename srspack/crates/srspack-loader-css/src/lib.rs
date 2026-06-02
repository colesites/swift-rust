use std::path::Path;

use async_trait::async_trait;
use srspack_core::loader::{Loader, LoaderContext, LoaderOutput};

/// CSS loader. Extracts class-name → hashed-name mappings for `.module.css`
/// files, returns the source for plain `.css` files. The runtime side of
/// CSS Modules is provided by the Swift-Rust server's stylesheet pipeline.
pub struct CssLoader;

impl CssLoader {
    pub fn new() -> Self {
        Self
    }
}

impl Default for CssLoader {
    fn default() -> Self {
        Self::new()
    }
}

#[async_trait]
impl Loader for CssLoader {
    fn name(&self) -> &'static str {
        "css"
    }

    fn test(&self, path: &Path) -> bool {
        matches!(
            path.extension().and_then(|e| e.to_str()),
            Some("css") | Some("scss") | Some("sass") | Some("less")
        )
    }

    async fn transform(
        &self,
        ctx: LoaderContext,
    ) -> Result<LoaderOutput, Box<dyn std::error::Error + Send + Sync>> {
        let is_module = ctx.path.to_string_lossy().ends_with(".module.css");
        let code = if is_module {
            transform_module(&ctx.source)?
        } else {
            transform_plain(&ctx.source)
        };
        let mut out = LoaderOutput::new(ctx.module_id, code);
        out.sourcemap = None;
        Ok(out)
    }
}

fn transform_plain(source: &str) -> String {
    source.to_string()
}

/// Minimal CSS Modules pass: rewrite each `.foo` selector to `.foo_<hash>`
/// and emit a JSON map of original → hashed class names. Real production
/// version will use lightningcss or postcss-rs.
fn transform_module(source: &str) -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
    use blake3::Hasher;
    let mut hasher = Hasher::new();
    hasher.update(source.as_bytes());
    let hash = hasher.finalize();
    let short = &hex::encode(hash.as_bytes())[..8];
    let prefix = format!("m{short}_");

    let mut class_map: std::collections::BTreeMap<String, String> = Default::default();
    let mut out = String::with_capacity(source.len());

    let mut chars = source.chars().peekable();
    while let Some(c) = chars.next() {
        if c == '.' {
            let mut name = String::new();
            while let Some(&nc) = chars.peek() {
                if nc.is_ascii_alphanumeric() || nc == '_' || nc == '-' {
                    name.push(nc);
                    chars.next();
                } else {
                    break;
                }
            }
            if !name.is_empty() {
                let hashed = format!("{prefix}{name}");
                class_map.entry(name.clone()).or_insert_with(|| hashed.clone());
                out.push('.');
                out.push_str(&hashed);
            } else {
                out.push(c);
            }
        } else {
            out.push(c);
        }
    }

    let map_json = serde_json::to_string(&class_map).unwrap_or_else(|_| "{}".to_string());
    let export = format!("\n\n/* __SRSPACK_CSS_MODULES_MAP__ */\nconst classes = {map_json};\nexport default classes;\n");
    out.push_str(&export);
    Ok(out)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;
    use srspack_core::graph::DependencyGraph;

    fn ctx(source: &str, name: &str) -> LoaderContext {
        let mut g = DependencyGraph::new();
        let id = g.add_module(PathBuf::from(name), source.to_string(), Some("css".into()));
        LoaderContext {
            module_id: id,
            path: PathBuf::from(name),
            source: source.to_string(),
            resolve_dir: PathBuf::from("app"),
        }
    }

    #[test]
    fn test_plain_passthrough() {
        let c = ctx(".foo { color: red; }", "app/global.css");
        let out = transform_plain(&c.source);
        assert_eq!(out, ".foo { color: red; }");
    }

    #[test]
    fn test_module_hashes_classes() {
        let c = ctx(".foo { color: red; } .bar { color: blue; }", "app/x.module.css");
        let out = transform_module(&c.source).unwrap();
        assert!(out.contains("m"));
        assert!(out.contains("__SRSPACK_CSS_MODULES_MAP__"));
        assert!(out.contains("export default classes"));
    }
}
