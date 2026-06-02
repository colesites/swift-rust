use std::path::{Path, PathBuf};
use std::sync::Arc;

use notify_debouncer_mini::new_debouncer;
use parking_lot::RwLock;
use swift_rust_errors::Result;
use tokio::sync::mpsc;

pub struct BundleOutput {
    pub files: Vec<PathBuf>,
    pub manifest: serde_json::Value,
}

pub struct BuildOptions {
    pub mode: String,
    pub out_dir: PathBuf,
    pub sourcemap: bool,
    pub minify: bool,
}

impl Default for BuildOptions {
    fn default() -> Self {
        Self {
            mode: "ssr".into(),
            out_dir: PathBuf::from(".swift-rust"),
            sourcemap: true,
            minify: true,
        }
    }
}

pub struct Bundler {
    cache: Arc<RwLock<std::collections::HashMap<PathBuf, Vec<u8>>>>,
}

impl Default for Bundler {
    fn default() -> Self {
        Self::new()
    }
}

impl Bundler {
    pub fn new() -> Self {
        Self {
            cache: Arc::new(RwLock::new(std::collections::HashMap::new())),
        }
    }

    pub async fn build(&self, opts: &BuildOptions) -> Result<BundleOutput> {
        tracing::info!(mode = %opts.mode, out = ?opts.out_dir, "bundling");
        std::fs::create_dir_all(&opts.out_dir)?;
        let manifest = serde_json::json!({
            "mode": opts.mode,
            "files": [],
            "version": env!("CARGO_PKG_VERSION"),
        });
        Ok(BundleOutput {
            files: Vec::new(),
            manifest,
        })
    }

    pub fn cache_get(&self, path: &Path) -> Option<Vec<u8>> {
        self.cache.read().get(path).cloned()
    }

    pub fn cache_put(&self, path: PathBuf, bytes: Vec<u8>) {
        self.cache.write().insert(path, bytes);
    }
}

pub async fn build(mode: &str) -> Result<()> {
    let bundler = Bundler::new();
    let opts = BuildOptions {
        mode: mode.to_string(),
        ..Default::default()
    };
    bundler.build(&opts).await?;
    Ok(())
}

pub async fn watch() -> Result<()> {
    let (tx, mut rx) = mpsc::channel::<notify_debouncer_mini::DebouncedEvent>(100);
    let mut debouncer = new_debouncer(std::time::Duration::from_millis(200), move |res| {
        if let Ok(events) = res {
            for ev in events {
                let _ = tx.blocking_send(ev);
            }
        }
    })
    .map_err(|e| swift_rust_errors::Error::Bundling {
        message: e.to_string(),
    })?;
    debouncer
        .watcher()
        .watch(Path::new("."), notify::RecursiveMode::Recursive)
        .map_err(|e| swift_rust_errors::Error::Bundling {
            message: e.to_string(),
        })?;

    tracing::info!("file watcher started");
    while let Some(_ev) = rx.recv().await {
        tracing::debug!("file changed, triggering rebuild");
    }
    Ok(())
}
