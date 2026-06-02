use std::collections::HashMap;
use std::path::PathBuf;

use blake3::Hash;
use parking_lot::RwLock;

/// Content-addressed cache. Keys are blake3 hashes of file contents; values
/// are the bytes of the compiled output. A hit short-circuits the loader
/// pipeline entirely.
pub struct ContentCache {
    entries: RwLock<HashMap<Hash, CacheEntry>>,
    root: RwLock<PathBuf>,
}

#[derive(Debug, Clone)]
pub struct CacheEntry {
    pub hash: Hash,
    pub bytes: Vec<u8>,
    pub kind: CacheKind,
    pub created_at: std::time::SystemTime,
    pub hits: u64,
    pub misses: u64,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CacheKind {
    Module,
    Chunk,
    Asset,
}

impl CacheEntry {
    pub fn new(hash: Hash, bytes: Vec<u8>, kind: CacheKind) -> Self {
        Self {
            hash,
            bytes,
            kind,
            created_at: std::time::SystemTime::now(),
            hits: 0,
            misses: 0,
        }
    }
}

impl ContentCache {
    pub fn new() -> Self {
        Self {
            entries: RwLock::new(HashMap::new()),
            root: RwLock::new(PathBuf::from(".srspack-cache")),
        }
    }

    pub fn with_root(root: PathBuf) -> Self {
        Self {
            entries: RwLock::new(HashMap::new()),
            root: RwLock::new(root),
        }
    }

    pub fn root(&self) -> PathBuf {
        self.root.read().clone()
    }

    pub fn get(&self, hash: &Hash) -> Option<CacheEntry> {
        let mut entries = self.entries.write();
        if let Some(entry) = entries.get_mut(hash) {
            entry.hits += 1;
            Some(entry.clone())
        } else {
            None
        }
    }

    pub fn put(&self, entry: CacheEntry) {
        self.entries.write().insert(entry.hash, entry);
    }

    pub fn invalidate(&self, hash: &Hash) {
        self.entries.write().remove(hash);
    }

    pub fn clear(&self) {
        self.entries.write().clear();
    }

    pub fn len(&self) -> usize {
        self.entries.read().len()
    }

    pub fn is_empty(&self) -> bool {
        self.entries.read().is_empty()
    }

    /// Hit rate over the lifetime of the cache, since last `clear()`.
    pub fn hit_rate(&self) -> f64 {
        let entries = self.entries.read();
        if entries.is_empty() {
            return 0.0;
        }
        let hits: u64 = entries.values().map(|e| e.hits).sum();
        let total: u64 = entries.values().map(|e| e.hits + e.misses).sum();
        if total == 0 {
            0.0
        } else {
            hits as f64 / total as f64
        }
    }
}

impl Default for ContentCache {
    fn default() -> Self {
        Self::new()
    }
}
