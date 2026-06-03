use std::path::{Path, PathBuf};
use std::sync::Arc;

use parking_lot::RwLock;
use tracing::info;

mod cache;
pub mod compress;
pub mod graph;
pub mod loader;
pub mod options;
pub mod profile;
pub mod result;

pub use cache::{CacheEntry, CacheKind, ContentCache};
pub use compress::{
    classify, compress_directory, compress_file, CompressCache, CompressKind, CompressSummary,
    CompressedFile,
};
pub use graph::{Asset, Chunk, DependencyGraph, Module, ModuleId};
pub use loader::{select_loader, Loader, LoaderContext, LoaderOutput};
pub use options::{BundleOptions, Mode, Target};
pub use profile::{Profile, Stage};
pub use result::{Error, Output, Result};

pub struct Srspack {
    graph: Arc<RwLock<DependencyGraph>>,
    cache: Arc<ContentCache>,
    loaders: Arc<RwLock<Vec<Box<dyn Loader>>>>,
    bundler: swift_rust_bundler::Bundler,
    compress_cache: Arc<CompressCache>,
}

impl Default for Srspack {
    fn default() -> Self {
        Self::new()
    }
}

impl Srspack {
    pub fn new() -> Self {
        Self {
            graph: Arc::new(RwLock::new(DependencyGraph::new())),
            cache: Arc::new(ContentCache::new()),
            loaders: Arc::new(RwLock::new(Vec::new())),
            bundler: swift_rust_bundler::Bundler::new(),
            compress_cache: Arc::new(CompressCache::new()),
        }
    }

    pub fn register_loader(&self, loader: Box<dyn Loader>) {
        self.loaders.write().push(loader);
    }

    pub fn graph(&self) -> Arc<RwLock<DependencyGraph>> {
        Arc::clone(&self.graph)
    }

    pub fn cache(&self) -> Arc<ContentCache> {
        Arc::clone(&self.cache)
    }

    pub fn compress_cache(&self) -> Arc<CompressCache> {
        Arc::clone(&self.compress_cache)
    }

    pub fn bundler(&self) -> &swift_rust_bundler::Bundler {
        &self.bundler
    }

    pub fn build(&self, root: &Path, opts: &BundleOptions) -> Result<Output> {
        let mut profile = Profile::new();
        self.build_with_profile(root, opts, &mut profile)
    }

    pub fn build_with_profile(
        &self,
        root: &Path,
        opts: &BundleOptions,
        profile: &mut Profile,
    ) -> Result<Output> {
        profile.start();
        info!(?root, out = ?opts.out_dir, mode = %opts.mode, "srspack build starting");

        profile.begin("walk");
        let ids = self.populate_graph_from_disk(root)?;
        profile.end();

        let internal_opts = swift_rust_bundler::BuildOptions {
            mode: opts.mode.as_str().to_string(),
            out_dir: opts.out_dir.clone(),
            sourcemap: opts.sourcemap,
            minify: opts.minify,
        };

        profile.begin("bundle");
        let bundle_output = futures::executor::block_on(self.bundler.build(&internal_opts))?;
        profile.end();

        let files: Vec<PathBuf> = bundle_output.files.clone();
        let manifest = bundle_output.manifest.clone();
        let out_dir = opts.out_dir.clone();

        profile.begin("record_assets");
        let bytes_read = self.record_assets(&files)?;
        profile.record_bytes_in(bytes_read);
        profile.end();

        let public_dir = root.join("public");
        if public_dir.exists() {
            profile.begin("compress");
            let cache_dir = root.join(".srspack-cache");
            self.compress_cache.load(&cache_dir);
            let compressed =
                compress_directory(&public_dir, &out_dir, self.compress_cache.as_ref())?;
            self.compress_cache.save(&cache_dir);
            let summary = compress::summarize(&compressed);
            profile.record_bytes_in(summary.source_bytes);
            profile.record_bytes_out(summary.optimized_bytes);
            info!(
                files = summary.total_files,
                source_bytes = summary.source_bytes,
                optimized_bytes = summary.optimized_bytes,
                savings_pct = summary.savings_pct(),
                "compressed public/ assets"
            );
            profile.end();
        }

        info!(files = files.len(), modules = ids.len(), "srspack build complete");

        Ok(Output {
            files,
            manifest,
            out_dir,
        })
    }

    pub async fn build_async(&self, root: &Path, opts: &BundleOptions) -> Result<Output> {
        let mut profile = Profile::new();
        self.build_async_with_profile(root, opts, &mut profile).await
    }

    pub async fn build_async_with_profile(
        &self,
        root: &Path,
        opts: &BundleOptions,
        profile: &mut Profile,
    ) -> Result<Output> {
        profile.start();
        info!(?root, out = ?opts.out_dir, mode = %opts.mode, "srspack build starting (async)");

        profile.begin("walk");
        let ids = self.populate_graph_from_disk(root)?;
        profile.end();

        let internal_opts = swift_rust_bundler::BuildOptions {
            mode: opts.mode.as_str().to_string(),
            out_dir: opts.out_dir.clone(),
            sourcemap: opts.sourcemap,
            minify: opts.minify,
        };

        profile.begin("bundle");
        let bundle_output = self.bundler.build(&internal_opts).await?;
        profile.end();

        let files: Vec<PathBuf> = bundle_output.files.clone();
        let manifest = bundle_output.manifest.clone();
        let out_dir = opts.out_dir.clone();

        profile.begin("record_assets");
        let bytes_read = self.record_assets(&files)?;
        profile.record_bytes_in(bytes_read);
        profile.end();

        let public_dir = root.join("public");
        if public_dir.exists() {
            profile.begin("compress");
            let cache_dir = root.join(".srspack-cache");
            self.compress_cache.load(&cache_dir);
            let compressed =
                compress_directory(&public_dir, &out_dir, self.compress_cache.as_ref())?;
            self.compress_cache.save(&cache_dir);
            let summary = compress::summarize(&compressed);
            profile.record_bytes_in(summary.source_bytes);
            profile.record_bytes_out(summary.optimized_bytes);
            info!(
                files = summary.total_files,
                source_bytes = summary.source_bytes,
                optimized_bytes = summary.optimized_bytes,
                savings_pct = summary.savings_pct(),
                "compressed public/ assets (async)"
            );
            profile.end();
        }

        info!(files = files.len(), modules = ids.len(), "srspack build complete (async)");

        Ok(Output {
            files,
            manifest,
            out_dir,
        })
    }

    pub async fn watch(&self, root: &Path, opts: BundleOptions) -> Result<()> {
        use notify_debouncer_mini::new_debouncer;
        use tokio::sync::mpsc;

        let (tx, mut rx) = mpsc::channel(64);
        let mut debouncer = new_debouncer(std::time::Duration::from_millis(50), move |res| {
            let _ = tx.blocking_send(res);
        })?;

        debouncer
            .watcher()
            .watch(root, notify::RecursiveMode::Recursive)?;

        while let Some(event) = rx.recv().await {
            info!(?event, "change detected; rebuilding");
            self.build_async(root, &opts).await?;
        }

        Ok(())
    }

    fn populate_graph_from_disk(&self, root: &Path) -> Result<Vec<ModuleId>> {
        use std::time::Instant;

        let t_walk = Instant::now();
        let entries: Vec<PathBuf> = walkdir::WalkDir::new(root)
            .follow_links(false)
            .into_iter()
            .filter_entry(|e| !is_excluded(e.path()))
            .filter_map(|e| e.ok())
            .filter(|e| e.file_type().is_file())
            .map(|e| e.into_path())
            .collect();
        let walk_listing_us = t_walk.elapsed().as_micros() as u64;

        let t_read = Instant::now();
        use rayon::iter::{IntoParallelRefIterator, ParallelIterator};
        let loaded: Vec<(PathBuf, Option<&'static str>, Option<Arc<[u8]>>)> = entries
            .par_iter()
            .map(|p| {
                let loader = self.loader_name_for(p);
                let source = if loader.is_some() {
                    std::fs::read(p).ok().map(|v| v.into_boxed_slice().into())
                } else {
                    None
                };
                (p.clone(), loader, source)
            })
            .collect();
        let parallel_read_us = t_read.elapsed().as_micros() as u64;

        let t_insert = Instant::now();
        let mut g = self.graph.write();
        let mut module_ids = Vec::with_capacity(loaded.len());
        for (path, loader, source) in loaded {
            let id = g.add_module(path, source.unwrap_or_else(|| Arc::from([])), loader);
            module_ids.push(id);
        }
        let graph_insert_us = t_insert.elapsed().as_micros() as u64;

        tracing::debug!(
            walk_listing_us,
            parallel_read_us,
            graph_insert_us,
            "populate_graph_from_disk detailed"
        );
        Ok(module_ids)
    }

    fn loader_name_for(&self, path: &Path) -> Option<&'static str> {
        let ext = path.extension()?.to_str()?;
        match ext {
            "tsx" | "jsx" => Some("tsx"),
            "css" => Some("css"),
            _ => None,
        }
    }

    fn record_assets(&self, files: &[PathBuf]) -> Result<u64> {
        let mut g = self.graph.write();
        let mut total_bytes: u64 = 0;
        for path in files {
            let bytes = std::fs::read(path)?;
            total_bytes += bytes.len() as u64;
            let content_hash = blake3::hash(&bytes);
            let mime = mime_guess::from_path(path)
                .first_or_octet_stream()
                .to_string();
            g.add_asset(Asset {
                path: path.clone(),
                content_hash,
                mime,
                source: 0,
            });
        }
        Ok(total_bytes)
    }
}

fn is_excluded(path: &Path) -> bool {
    let s = path.as_os_str().as_encoded_bytes();
    contains_slash_segment(s, b".swift-rust")
        || contains_slash_segment(s, b"node_modules")
        || contains_slash_segment(s, b".git")
        || contains_slash_segment(s, b"dist")
        || contains_slash_segment(s, b".srspack-cache")
        || contains_slash_segment(s, b"public")
}

fn contains_slash_segment(haystack: &[u8], needle: &[u8]) -> bool {
    if needle.is_empty() {
        return true;
    }
    let mut i = 0;
    while i + needle.len() <= haystack.len() {
        if &haystack[i..i + needle.len()] == needle {
            let before = if i == 0 { None } else { Some(haystack[i - 1]) };
            let after_idx = i + needle.len();
            let after = haystack.get(after_idx).copied();
            if (before == Some(b'/') || before.is_none()) && (after == Some(b'/') || after.is_none()) {
                return true;
            }
        }
        i += 1;
    }
    false
}
