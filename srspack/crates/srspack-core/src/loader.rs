use std::path::PathBuf;

use crate::cache::CacheKind;
use crate::graph::ModuleId;

#[derive(Debug, Clone)]
pub struct LoaderContext {
    pub module_id: ModuleId,
    pub path: PathBuf,
    pub source: String,
    pub resolve_dir: PathBuf,
}

#[derive(Debug, Clone)]
pub struct LoaderOutput {
    pub module_id: ModuleId,
    pub code: String,
    pub sourcemap: Option<String>,
    pub kind: CacheKind,
    pub cacheable: bool,
}

impl LoaderOutput {
    pub fn new(module_id: ModuleId, code: impl Into<String>) -> Self {
        Self {
            module_id,
            code: code.into(),
            sourcemap: None,
            kind: CacheKind::Module,
            cacheable: true,
        }
    }
}

/// A loader transforms a module's source. Loaders are registered with
/// [`crate::Srspack::register_loader`] and selected by file extension or
/// by an explicit `loader` field in the import specifier.
#[async_trait::async_trait]
pub trait Loader: Send + Sync {
    fn name(&self) -> &'static str;
    fn test(&self, path: &std::path::Path) -> bool;

    async fn transform(
        &self,
        ctx: LoaderContext,
    ) -> Result<LoaderOutput, Box<dyn std::error::Error + Send + Sync>>;
}

/// Selects the right loader for a given path. Built-in loaders win over
/// user-registered ones when extensions overlap.
pub fn select_loader<'a>(
    path: &std::path::Path,
    loaders: &'a [Box<dyn Loader>],
) -> Option<&'a dyn Loader> {
    loaders.iter().find(|l| l.test(path)).map(|l| l.as_ref())
}
