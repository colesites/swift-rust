//! Asset compression for `public/`.
//!
//! Scans the user's `public/` directory, classifies each file by extension,
//! and produces an optimized sibling next to the original (or a brotli
//! sidecar `.br` for text). The original file is left intact so the
//! runtime can serve it as a fallback; the optimized file is what
//! `<Image>`, `<Video>`, the font loader, and the runtime negotiator pick
//! first.
//!
//! ## What is compressed
//!
//! | Kind   | Source exts                         | Output                          |
//! |--------|-------------------------------------|---------------------------------|
//! | image  | png, jpg, jpeg, gif, webp, tiff, tif | re-encoded webp (q=80), lossy   |
//! | text   | html, css, js, mjs, json, xml, svg  | brotli sidecar `.br` (q=11)     |
//! | passthru| everything else                    | copied verbatim                 |
//!
//! Videos and fonts are left alone in Phase 3; they need external tools
//! (ffmpeg / subsetter) and a separate design pass.
//!
//! ## Caching
//!
//! `CompressCache` is keyed by the blake3 hash of the *source* bytes. A
//! second build with unchanged sources returns the cached result without
//! re-running the encoder. The cache is in-memory; a future phase will
//! persist it to `.srspack-cache/compress.json` so cold incremental
//! builds also hit.

use std::path::{Path, PathBuf};
use std::sync::Arc;

use blake3::Hash;
use parking_lot::RwLock;
use rayon::iter::ParallelIterator;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tracing::{debug, trace, warn};
use walkdir::WalkDir;

use crate::Error;

/// Bump when the persisted manifest layout changes (invalidates old files).
const COMPRESS_MANIFEST_VERSION: u32 = 1;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum CompressKind {
    Image,
    Text,
    Pass,
}

impl CompressKind {
    pub fn as_str(&self) -> &'static str {
        match self {
            CompressKind::Image => "image",
            CompressKind::Text => "text",
            CompressKind::Pass => "pass",
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum ImageFormat {
    Png,
    Jpeg,
    Gif,
    WebP,
    Tiff,
}

impl ImageFormat {
    pub fn as_str(&self) -> &'static str {
        match self {
            ImageFormat::Png => "png",
            ImageFormat::Jpeg => "jpeg",
            ImageFormat::Gif => "gif",
            ImageFormat::WebP => "webp",
            ImageFormat::Tiff => "tiff",
        }
    }
}

#[derive(Debug, Clone)]
pub struct CompressedFile {
    pub source: PathBuf,
    pub source_hash: Hash,
    pub kind: CompressKind,
    pub source_bytes: u64,
    pub optimized_bytes: u64,
    pub output: PathBuf,
    pub format_in: Option<ImageFormat>,
    pub format_out: Option<String>,
}

impl CompressedFile {
    pub fn savings_pct(&self) -> f64 {
        if self.source_bytes == 0 {
            0.0
        } else {
            let saved = self.source_bytes as f64 - self.optimized_bytes as f64;
            (saved / self.source_bytes as f64) * 100.0
        }
    }

    pub fn savings_bytes(&self) -> i64 {
        self.optimized_bytes as i64 - self.source_bytes as i64
    }
}

#[derive(Debug, Default)]
pub struct CompressCache {
    entries: RwLock<HashMap<Hash, CompressedFile>>,
}

impl CompressCache {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn get(&self, hash: &Hash) -> Option<CompressedFile> {
        self.entries.read().get(hash).cloned()
    }

    pub fn put(&self, entry: CompressedFile) {
        self.entries.write().insert(entry.source_hash, entry);
    }

    pub fn len(&self) -> usize {
        self.entries.read().len()
    }

    pub fn is_empty(&self) -> bool {
        self.entries.read().is_empty()
    }

    pub fn clear(&self) {
        self.entries.write().clear();
    }

    /// Load a previously persisted manifest from `<cache_dir>/compress.json`
    /// into memory. Missing/corrupt/old-version files are ignored (cold start).
    /// This is what lets a *fresh process* (e.g. an incremental `srspack build`)
    /// skip re-encoding assets it already compressed on a prior run.
    pub fn load(&self, cache_dir: &Path) {
        let path = cache_dir.join("compress.json");
        let Ok(bytes) = std::fs::read(&path) else { return };
        let Ok(doc) = serde_json::from_slice::<PersistedCompress>(&bytes) else { return };
        if doc.version != COMPRESS_MANIFEST_VERSION {
            return;
        }
        let mut map = self.entries.write();
        for e in doc.entries {
            let Ok(hash) = Hash::from_hex(e.hash.as_bytes()) else { continue };
            map.insert(
                hash,
                CompressedFile {
                    source: PathBuf::from(e.source),
                    source_hash: hash,
                    kind: e.kind,
                    source_bytes: e.source_bytes,
                    optimized_bytes: e.optimized_bytes,
                    output: PathBuf::from(e.output),
                    format_in: e.format_in,
                    format_out: e.format_out,
                },
            );
        }
    }

    /// Persist the in-memory manifest to `<cache_dir>/compress.json`. Best
    /// effort — failures are swallowed so a read-only cache dir never breaks a
    /// build.
    pub fn save(&self, cache_dir: &Path) {
        let entries: Vec<PersistedEntry> = self
            .entries
            .read()
            .values()
            .map(|f| PersistedEntry {
                hash: f.source_hash.to_hex().to_string(),
                source: f.source.to_string_lossy().into_owned(),
                kind: f.kind,
                source_bytes: f.source_bytes,
                optimized_bytes: f.optimized_bytes,
                output: f.output.to_string_lossy().into_owned(),
                format_in: f.format_in,
                format_out: f.format_out.clone(),
            })
            .collect();
        let doc = PersistedCompress {
            version: COMPRESS_MANIFEST_VERSION,
            entries,
        };
        let Ok(json) = serde_json::to_vec(&doc) else { return };
        let _ = std::fs::create_dir_all(cache_dir);
        let _ = std::fs::write(cache_dir.join("compress.json"), json);
    }
}

#[derive(Serialize, Deserialize)]
struct PersistedCompress {
    version: u32,
    entries: Vec<PersistedEntry>,
}

#[derive(Serialize, Deserialize)]
struct PersistedEntry {
    hash: String,
    source: String,
    kind: CompressKind,
    source_bytes: u64,
    optimized_bytes: u64,
    output: String,
    format_in: Option<ImageFormat>,
    format_out: Option<String>,
}

pub fn classify(path: &Path) -> CompressKind {
    let ext = match path.extension().and_then(|e| e.to_str()) {
        Some(e) => e.to_ascii_lowercase(),
        None => return CompressKind::Pass,
    };
    match ext.as_str() {
        "png" | "jpg" | "jpeg" | "gif" | "webp" | "tiff" | "tif" => CompressKind::Image,
        "html" | "htm" | "css" | "js" | "mjs" | "cjs" | "json" | "xml" | "svg" | "txt" | "md" => {
            CompressKind::Text
        }
        _ => CompressKind::Pass,
    }
}

pub fn detect_image_format(path: &Path) -> Option<ImageFormat> {
    let ext = path.extension().and_then(|e| e.to_str())?.to_ascii_lowercase();
    match ext.as_str() {
        "png" => Some(ImageFormat::Png),
        "jpg" | "jpeg" => Some(ImageFormat::Jpeg),
        "gif" => Some(ImageFormat::Gif),
        "webp" => Some(ImageFormat::WebP),
        "tiff" | "tif" => Some(ImageFormat::Tiff),
        _ => None,
    }
}

pub fn output_path_for(source: &Path, kind: CompressKind, format_in: Option<ImageFormat>) -> PathBuf {
    let stem = source
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or("file");
    let parent = source.parent().unwrap_or_else(|| Path::new("."));
    match kind {
        CompressKind::Image => {
            parent.join(format!("{stem}.opt.{}", default_image_ext(format_in)))
        }
        CompressKind::Text => parent.join(format!(
            "{}.{}.br",
            source.file_name().and_then(|s| s.to_str()).unwrap_or("file"),
            "txt"
        )),
        CompressKind::Pass => source.to_path_buf(),
    }
}

fn default_image_ext(format_in: Option<ImageFormat>) -> &'static str {
    match format_in {
        Some(ImageFormat::WebP) => "webp",
        _ => "jpg",
    }
}

pub fn compress_file(
    source: &Path,
    out_dir: &Path,
    cache: &CompressCache,
) -> Result<CompressedFile, Error> {
    let bytes = std::fs::read(source)?;
    let source_hash = blake3::hash(&bytes);
    let source_bytes = bytes.len() as u64;

    // Cache hit only counts if the optimized output still exists on disk —
    // otherwise a cleared dist/ would leave us referencing a missing file.
    if let Some(hit) = cache.get(&source_hash) {
        if hit.kind == CompressKind::Pass || hit.output.exists() {
            trace!(?source, "compress cache hit");
            return Ok(hit);
        }
    }

    let kind = classify(source);
    let format_in = detect_image_format(source);
    let output = if out_dir == source.parent().unwrap_or(Path::new(".")) {
        output_path_for(source, kind, format_in)
    } else {
        let rel = source.file_name().unwrap_or_else(|| std::ffi::OsStr::new(""));
        let optimized = output_path_for(Path::new(rel), kind, format_in);
        out_dir.join(optimized)
    };

    if source_bytes < 64 {
        let entry = CompressedFile {
            source: source.to_path_buf(),
            source_hash,
            kind: CompressKind::Pass,
            source_bytes,
            optimized_bytes: source_bytes,
            output: source.to_path_buf(),
            format_in,
            format_out: None,
        };
        cache.put(entry.clone());
        return Ok(entry);
    }

    if let Some(parent) = output.parent() {
        std::fs::create_dir_all(parent)?;
    }

    let (optimized_bytes, format_out, output) = match kind {
        CompressKind::Image => {
            let (optimized, chosen_ext) = compress_image(&bytes, format_in)?;
            let final_output = output.with_extension(chosen_ext);
            if let Some(parent) = final_output.parent() {
                std::fs::create_dir_all(parent)?;
            }
            if optimized.len() as u64 >= source_bytes {
                std::fs::write(&final_output, &bytes)?;
                (source_bytes, None, final_output.with_extension(source.extension().and_then(|e| e.to_str()).unwrap_or("bin")))
            } else {
                std::fs::write(&final_output, &optimized)?;
                (optimized.len() as u64, Some(chosen_ext.to_string()), final_output)
            }
        }
        CompressKind::Text => {
            let optimized = compress_text(&bytes)?;
            let final_output = output;
            if optimized.len() as u64 >= source_bytes {
                std::fs::write(&final_output, &bytes)?;
                (source_bytes, None, final_output.with_extension(""))
            } else {
                std::fs::write(&final_output, &optimized)?;
                (optimized.len() as u64, Some("br".to_string()), final_output)
            }
        }
        CompressKind::Pass => {
            std::fs::write(&output, &bytes)?;
            (source_bytes, None, output)
        }
    };

    let entry = CompressedFile {
        source: source.to_path_buf(),
        source_hash,
        kind,
        source_bytes,
        optimized_bytes,
        output,
        format_in,
        format_out,
    };
    cache.put(entry.clone());
    debug!(
        ?source,
        kind = kind.as_str(),
        source_bytes,
        optimized_bytes,
        savings_pct = entry.savings_pct(),
        "compressed"
    );
    Ok(entry)
}

fn compress_image(bytes: &[u8], format: Option<ImageFormat>) -> Result<(Vec<u8>, &'static str), Error> {
    let format = format.ok_or_else(|| Error::Compress("unknown image format".into()))?;
    let img = image::load_from_memory(bytes).map_err(|e| Error::Compress(e.to_string()))?;
    let has_alpha = img.color().has_alpha();
    let _ = format;
    let mut out = Vec::with_capacity(bytes.len() / 2);
    if has_alpha {
        let encoder = image::codecs::webp::WebPEncoder::new_lossless(&mut out);
        let rgba8 = img.to_rgba8();
        encoder
            .encode(
                rgba8.as_raw(),
                rgba8.width(),
                rgba8.height(),
                image::ColorType::Rgba8,
            )
            .map_err(|e| Error::Compress(e.to_string()))?;
        Ok((out, "webp"))
    } else {
        let mut encoder = image::codecs::jpeg::JpegEncoder::new_with_quality(&mut out, 80);
        let rgb8 = img.to_rgb8();
        encoder
            .encode(
                rgb8.as_raw(),
                rgb8.width(),
                rgb8.height(),
                image::ColorType::Rgb8,
            )
            .map_err(|e| Error::Compress(e.to_string()))?;
        Ok((out, "jpg"))
    }
}

fn compress_text(bytes: &[u8]) -> Result<Vec<u8>, Error> {
    let mut out = Vec::with_capacity(bytes.len() / 3);
    let params = brotli::enc::BrotliEncoderParams {
        quality: 4,
        lgwin: 22,
        ..Default::default()
    };
    brotli::BrotliCompress(&mut &bytes[..], &mut out, &params)
        .map_err(|e| Error::Compress(e.to_string()))?;
    Ok(out)
}

pub fn compress_directory(
    public_dir: &Path,
    out_dir: &Path,
    cache: &CompressCache,
) -> Result<Vec<CompressedFile>, Error> {
    if !public_dir.exists() {
        return Ok(Vec::new());
    }
    let sources: Vec<PathBuf> = WalkDir::new(public_dir)
        .follow_links(false)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.file_type().is_file())
        .map(|e| e.path().to_path_buf())
        .collect();
    if sources.is_empty() {
        return Ok(Vec::new());
    }
    let sources_arc = Arc::new(sources);
    let public_dir_arc = Arc::new(public_dir.to_path_buf());
    let out_dir_arc = Arc::new(out_dir.to_path_buf());
    let results: Vec<Result<CompressedFile, Error>> = {
        let sources_slice: &[PathBuf] = sources_arc.as_slice();
        // Use the shared (and now persisted) cache for lookups so unchanged
        // assets skip re-encoding across runs. CompressCache is internally
        // synchronized, so it is safe to share across rayon workers.
        rayon::iter::IntoParallelRefIterator::par_iter(sources_slice)
            .map(|src| {
                let local_out = if src.starts_with(public_dir_arc.as_path()) {
                    let rel = src.strip_prefix(public_dir_arc.as_path()).unwrap();
                    out_dir_arc.join(rel)
                } else {
                    out_dir_arc.as_path().to_path_buf()
                };
                compress_file(src, &local_out, cache)
            })
            .collect()
    };
    let mut files = Vec::with_capacity(results.len());
    for r in results {
        match r {
            Ok(f) => {
                cache.put(f.clone());
                files.push(f);
            }
            Err(e) => warn!(?e, "compress failed for one file; continuing"),
        }
    }
    files.sort_by(|a, b| a.source.cmp(&b.source));
    Ok(files)
}

pub fn summarize(files: &[CompressedFile]) -> CompressSummary {
    let mut s = CompressSummary::default();
    for f in files {
        s.total_files += 1;
        s.source_bytes += f.source_bytes;
        s.optimized_bytes += f.optimized_bytes;
        match f.kind {
            CompressKind::Image => s.images += 1,
            CompressKind::Text => s.text += 1,
            CompressKind::Pass => s.passthru += 1,
        }
    }
    s
}

#[derive(Debug, Default, Clone, Copy)]
pub struct CompressSummary {
    pub total_files: usize,
    pub images: usize,
    pub text: usize,
    pub passthru: usize,
    pub source_bytes: u64,
    pub optimized_bytes: u64,
}

impl CompressSummary {
    pub fn savings_pct(&self) -> f64 {
        if self.source_bytes == 0 {
            0.0
        } else {
            let saved = self.source_bytes as f64 - self.optimized_bytes as f64;
            (saved / self.source_bytes as f64) * 100.0
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use image::{ImageBuffer, Rgb, Rgba};
    use std::path::PathBuf;

    fn make_png(path: &Path, w: u32, h: u32, with_alpha: bool) {
        let parent = path.parent().unwrap();
        std::fs::create_dir_all(parent).unwrap();
        if with_alpha {
            let img: ImageBuffer<Rgba<u8>, Vec<u8>> = ImageBuffer::from_fn(w, h, |x, y| {
                Rgba([(x % 255) as u8, (y % 255) as u8, ((x + y) % 255) as u8, 200])
            });
            img.save(path).unwrap();
        } else {
            let img: ImageBuffer<Rgb<u8>, Vec<u8>> = ImageBuffer::from_fn(w, h, |x, y| {
                Rgb([(x % 255) as u8, (y % 255) as u8, ((x + y) % 255) as u8])
            });
            img.save(path).unwrap();
        }
    }

    fn make_text(path: &Path, body: &str) {
        let parent = path.parent().unwrap();
        std::fs::create_dir_all(parent).unwrap();
        std::fs::write(path, body).unwrap();
    }

    #[test]
    fn classify_png_is_image() {
        assert_eq!(classify(Path::new("a.png")), CompressKind::Image);
        assert_eq!(classify(Path::new("a.JPG")), CompressKind::Image);
        assert_eq!(classify(Path::new("a.webp")), CompressKind::Image);
    }

    #[test]
    fn classify_text() {
        assert_eq!(classify(Path::new("a.css")), CompressKind::Text);
        assert_eq!(classify(Path::new("a.html")), CompressKind::Text);
        assert_eq!(classify(Path::new("a.json")), CompressKind::Text);
        assert_eq!(classify(Path::new("a.svg")), CompressKind::Text);
    }

    #[test]
    fn classify_unknown_is_pass() {
        assert_eq!(classify(Path::new("a.bin")), CompressKind::Pass);
        assert_eq!(classify(Path::new("a")), CompressKind::Pass);
    }

    #[test]
    fn compress_jpeg_smaller_than_png() {
        let tmp = std::env::temp_dir().join("srspack_test_png");
        let _ = std::fs::remove_dir_all(&tmp);
        let src = tmp.join("photo.png");
        make_png(&src, 200, 200, false);
        let out = tmp.join("dist");
        let cache = CompressCache::new();
        let result = compress_file(&src, &out, &cache).unwrap();
        assert_eq!(result.kind, CompressKind::Image);
        assert!(result.optimized_bytes < result.source_bytes,
                "expected {} < {}", result.optimized_bytes, result.source_bytes);
        assert!(result.output.exists());
        assert!(result.format_out.as_deref() == Some("jpg"));
    }

    #[test]
    fn compress_png_with_alpha_uses_webp() {
        let tmp = std::env::temp_dir().join("srspack_test_alpha");
        let _ = std::fs::remove_dir_all(&tmp);
        let src = tmp.join("logo.png");
        make_png(&src, 100, 100, true);
        let out = tmp.join("dist");
        let cache = CompressCache::new();
        let result = compress_file(&src, &out, &cache).unwrap();
        assert_eq!(result.kind, CompressKind::Image);
        assert!(result.format_out.as_deref() == Some("webp"));
    }

    #[test]
    fn compress_text_produces_brotli() {
        let tmp = std::env::temp_dir().join("srspack_test_text");
        let _ = std::fs::remove_dir_all(&tmp);
        let src = tmp.join("style.css");
        let body = "body { color: red; }\n".repeat(200);
        make_text(&src, &body);
        let out = tmp.join("dist");
        let cache = CompressCache::new();
        let result = compress_file(&src, &out, &cache).unwrap();
        assert_eq!(result.kind, CompressKind::Text);
        assert!(result.optimized_bytes < result.source_bytes);
        assert!(result.format_out.as_deref() == Some("br"));
    }

    #[test]
    fn compress_cache_hits_on_repeat() {
        let tmp = std::env::temp_dir().join("srspack_test_cache");
        let _ = std::fs::remove_dir_all(&tmp);
        let src = tmp.join("photo.png");
        make_png(&src, 80, 80, false);
        let out = tmp.join("dist");
        let cache = CompressCache::new();
        let r1 = compress_file(&src, &out, &cache).unwrap();
        let r2 = compress_file(&src, &out, &cache).unwrap();
        assert_eq!(r1.source_hash, r2.source_hash);
        assert_eq!(r1.optimized_bytes, r2.optimized_bytes);
        assert_eq!(cache.len(), 1);
    }

    #[test]
    fn compress_directory_handles_missing_dir() {
        let tmp = std::env::temp_dir().join("srspack_does_not_exist_xyz");
        let _ = std::fs::remove_dir_all(&tmp);
        let cache = CompressCache::new();
        let files = compress_directory(&tmp, Path::new("dist"), &cache).unwrap();
        assert!(files.is_empty());
    }

    #[test]
    fn compress_directory_mixed_kinds() {
        let tmp = std::env::temp_dir().join("srspack_test_mixed");
        let _ = std::fs::remove_dir_all(&tmp);
        let public = tmp.join("public");
        std::fs::create_dir_all(&public).unwrap();
        make_png(&public.join("a.png"), 60, 60, false);
        make_png(&public.join("b.png"), 60, 60, true);
        make_text(&public.join("c.css"), ".x{color:red;}\n".repeat(50).as_str());
        let out = tmp.join("dist");
        let cache = CompressCache::new();
        let files = compress_directory(&public, &out, &cache).unwrap();
        assert_eq!(files.len(), 3);
        let summary = summarize(&files);
        assert_eq!(summary.images, 2);
        assert_eq!(summary.text, 1);
        assert!(summary.savings_pct() > 0.0);
    }

    #[test]
    fn output_path_for_images() {
        let p = output_path_for(Path::new("a.png"), CompressKind::Image, Some(ImageFormat::Png));
        assert_eq!(p, PathBuf::from("a.opt.jpg"));
        let p = output_path_for(Path::new("a.jpg"), CompressKind::Image, Some(ImageFormat::Jpeg));
        assert_eq!(p, PathBuf::from("a.opt.jpg"));
        let p = output_path_for(Path::new("a.webp"), CompressKind::Image, Some(ImageFormat::WebP));
        assert_eq!(p, PathBuf::from("a.opt.webp"));
    }

    #[test]
    fn output_path_for_text_appends_br() {
        let p = output_path_for(Path::new("style.css"), CompressKind::Text, None);
        assert_eq!(p, PathBuf::from("style.css.txt.br"));
    }
}
