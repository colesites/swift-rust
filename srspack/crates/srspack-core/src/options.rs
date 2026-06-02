use std::path::PathBuf;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BundleOptions {
    pub mode: Mode,
    pub out_dir: PathBuf,
    pub sourcemap: bool,
    pub minify: bool,
    pub target: Target,
    pub externals: Vec<String>,
}

impl Default for BundleOptions {
    fn default() -> Self {
        Self {
            mode: Mode::Development,
            out_dir: PathBuf::from("dist"),
            sourcemap: true,
            minify: false,
            target: Target::default(),
            externals: Vec::new(),
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum Mode {
    Development,
    Production,
}

impl Mode {
    pub fn as_str(&self) -> &'static str {
        match self {
            Mode::Development => "development",
            Mode::Production => "production",
        }
    }

    pub fn from_mode_str(s: &str) -> Option<Self> {
        match s {
            "development" | "dev" => Some(Mode::Development),
            "production" | "prod" => Some(Mode::Production),
            _ => None,
        }
    }
}

impl std::fmt::Display for Mode {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(self.as_str())
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Target {
    pub browsers: Vec<String>,
    pub node: Option<String>,
    pub deno: Option<String>,
    pub bun: Option<String>,
}

impl Default for Target {
    fn default() -> Self {
        Self {
            browsers: vec!["last 2 versions".to_string()],
            node: None,
            deno: None,
            bun: Some(">=1.3.0".to_string()),
        }
    }
}
