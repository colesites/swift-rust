use serde::{Deserialize, Serialize};
use swift_rust_errors::{Error, Result};

#[derive(Debug, Clone, Copy, Default, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "kebab-case")]
pub enum RenderingMode {
    #[default]
    Ssr,
    SsrWasm,
    SsrHtmx,
    Wasm,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ImageConfig {
    #[serde(default)]
    pub domains: Vec<String>,
    #[serde(default)]
    pub formats: Vec<String>,
    #[serde(default = "default_device_sizes")]
    pub device_sizes: Vec<u32>,
    #[serde(default = "default_image_sizes")]
    pub image_sizes: Vec<u32>,
    #[serde(default = "default_minimum_cache_ttl")]
    pub minimum_cache_ttl: u32,
}

impl Default for ImageConfig {
    fn default() -> Self {
        Self {
            domains: Vec::new(),
            formats: vec!["image/webp".into()],
            device_sizes: default_device_sizes(),
            image_sizes: default_image_sizes(),
            minimum_cache_ttl: default_minimum_cache_ttl(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FontConfig {
    #[serde(default)]
    pub subsets: Vec<String>,
    #[serde(default = "default_display")]
    pub display: String,
    #[serde(default)]
    pub preload: bool,
    #[serde(default)]
    pub adjust_fallback: bool,
}

impl Default for FontConfig {
    fn default() -> Self {
        Self {
            subsets: vec!["latin".into()],
            display: default_display(),
            preload: false,
            adjust_fallback: false,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PdfConfig {
    #[serde(default = "default_page_size")]
    pub default_page_size: String,
    #[serde(default = "default_orientation")]
    pub default_orientation: String,
    #[serde(default)]
    pub compress: bool,
}

impl Default for PdfConfig {
    fn default() -> Self {
        Self {
            default_page_size: default_page_size(),
            default_orientation: default_orientation(),
            compress: true,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct Config {
    #[serde(default)]
    pub rendering: RenderingMode,
    #[serde(default)]
    pub image: ImageConfig,
    #[serde(default)]
    pub font: FontConfig,
    #[serde(default)]
    pub pdf: PdfConfig,
}

impl Config {
    pub fn load() -> Result<Self> {
        let raw = std::fs::read_to_string("swift-rust.config.json")
            .or_else(|_| std::fs::read_to_string("swift-rust.config.toml"))
            .or_else(|_| std::fs::read_to_string("swift-rust.config.yaml"));

        match raw {
            Ok(content) => Self::parse(&content),
            Err(_) => Ok(Self::default()),
        }
    }

    pub fn parse(content: &str) -> Result<Self> {
        if let Ok(c) = serde_json::from_str::<Self>(content) {
            return Ok(c);
        }
        if let Ok(c) = toml::from_str::<Self>(content) {
            return Ok(c);
        }
        if let Ok(c) = serde_yaml::from_str::<Self>(content) {
            return Ok(c);
        }
        Err(Error::Config {
            message: "failed to parse config in any supported format".into(),
        })
    }
}

fn default_device_sizes() -> Vec<u32> {
    vec![640, 750, 828, 1080, 1200, 1920, 2048, 3840]
}

fn default_image_sizes() -> Vec<u32> {
    vec![16, 32, 48, 64, 96, 128, 256, 384]
}

fn default_minimum_cache_ttl() -> u32 {
    60
}

fn default_display() -> String {
    "swap".into()
}

fn default_page_size() -> String {
    "A4".into()
}

fn default_orientation() -> String {
    "portrait".into()
}
