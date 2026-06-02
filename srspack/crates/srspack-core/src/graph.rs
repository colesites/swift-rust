use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::Arc;

use blake3::Hash;

pub type ModuleId = u64;

#[derive(Debug, Clone)]
pub struct Module {
    pub id: ModuleId,
    pub path: PathBuf,
    pub source: Arc<[u8]>,
    pub content_hash: Hash,
    pub loader: Option<String>,
    pub deps: Vec<ModuleId>,
}

#[derive(Debug, Clone)]
pub struct Chunk {
    pub id: u64,
    pub modules: Vec<ModuleId>,
    pub entry: bool,
}

#[derive(Debug, Clone)]
pub struct Asset {
    pub path: PathBuf,
    pub content_hash: Hash,
    pub mime: String,
    pub source: ModuleId,
}

#[derive(Default)]
pub struct DependencyGraph {
    modules: HashMap<ModuleId, Module>,
    chunks: HashMap<u64, Chunk>,
    assets: HashMap<PathBuf, Asset>,
    next_module_id: ModuleId,
    next_chunk_id: u64,
    by_path: HashMap<PathBuf, ModuleId>,
}

impl DependencyGraph {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn add_module(&mut self, path: PathBuf, source: Arc<[u8]>, loader: Option<&'static str>) -> ModuleId {
        if let Some(existing) = self.by_path.get(&path).copied() {
            return existing;
        }
        let id = self.next_module_id;
        self.next_module_id += 1;
        let content_hash = blake3::hash(&source);
        self.modules.insert(
            id,
            Module {
                id,
                path: path.clone(),
                source,
                content_hash,
                loader: loader.map(|s| s.to_string()),
                deps: Vec::new(),
            },
        );
        self.by_path.insert(path, id);
        id
    }

    pub fn add_dep(&mut self, from: ModuleId, to: ModuleId) {
        if let Some(m) = self.modules.get_mut(&from) {
            if !m.deps.contains(&to) {
                m.deps.push(to);
            }
        }
    }

    pub fn add_chunk(&mut self, entry_modules: Vec<ModuleId>) -> u64 {
        let id = self.next_chunk_id;
        self.next_chunk_id += 1;
        let entry = !entry_modules.is_empty();
        self.chunks.insert(
            id,
            Chunk {
                id,
                modules: entry_modules,
                entry,
            },
        );
        id
    }

    pub fn add_asset(&mut self, asset: Asset) {
        self.assets.insert(asset.path.clone(), asset);
    }

    pub fn module(&self, id: ModuleId) -> Option<&Module> {
        self.modules.get(&id)
    }

    pub fn module_by_path(&self, path: &PathBuf) -> Option<&Module> {
        self.by_path.get(path).and_then(|id| self.modules.get(id))
    }

    pub fn chunk(&self, id: u64) -> Option<&Chunk> {
        self.chunks.get(&id)
    }

    pub fn asset(&self, path: &PathBuf) -> Option<&Asset> {
        self.assets.get(path)
    }

    pub fn module_count(&self) -> usize {
        self.modules.len()
    }

    pub fn chunk_count(&self) -> usize {
        self.chunks.len()
    }

    pub fn asset_count(&self) -> usize {
        self.assets.len()
    }

    /// Topological order over the module graph. Returns modules in dependency
    /// order (deps before dependents). Used by the parallel build scheduler.
    pub fn topo_order(&self) -> Vec<ModuleId> {
        let mut visited: HashMap<ModuleId, u8> = HashMap::new();
        let mut order = Vec::with_capacity(self.modules.len());

        fn dfs(
            graph: &DependencyGraph,
            node: ModuleId,
            visited: &mut HashMap<ModuleId, u8>,
            order: &mut Vec<ModuleId>,
        ) {
            match visited.get(&node).copied() {
                Some(2) => return,
                Some(1) => return,
                _ => {}
            }
            visited.insert(node, 1);
            if let Some(m) = graph.module(node) {
                for &dep in &m.deps {
                    dfs(graph, dep, visited, order);
                }
            }
            visited.insert(node, 2);
            order.push(node);
        }

        let ids: Vec<ModuleId> = self.modules.keys().copied().collect();
        for id in ids {
            dfs(self, id, &mut visited, &mut order);
        }
        order
    }
}
