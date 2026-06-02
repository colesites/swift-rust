use serde::{Deserialize, Serialize};
use thiserror::Error;

pub type Result<T> = std::result::Result<T, Error>;

#[derive(Error, Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "kind", rename_all = "snake_case")]
pub enum Error {
    #[error("[SR0001] configuration error: {message}")]
    Config { message: String },

    #[error("[SR0002] routing error: {message}")]
    Routing { message: String },

    #[error("[SR0003] compilation error in {file}: {message}")]
    Compilation { file: String, message: String },

    #[error("[SR0004] bundling error: {message}")]
    Bundling { message: String },

    #[error("[SR0005] server error: {message}")]
    Server { message: String },

    #[error("[SR0006] image error: {message}")]
    Image { message: String },

    #[error("[SR0007] font error: {message}")]
    Font { message: String },

    #[error("[SR0008] pdf error: {message}")]
    Pdf { message: String },

    #[error("[SR0009] IO error: {0}")]
    Io(String),

    #[error("[SR0010] unknown error: {0}")]
    Unknown(String),
}

impl Error {
    pub fn code(&self) -> &'static str {
        match self {
            Self::Config { .. } => "SR0001",
            Self::Routing { .. } => "SR0002",
            Self::Compilation { .. } => "SR0003",
            Self::Bundling { .. } => "SR0004",
            Self::Server { .. } => "SR0005",
            Self::Image { .. } => "SR0006",
            Self::Font { .. } => "SR0007",
            Self::Pdf { .. } => "SR0008",
            Self::Io(_) => "SR0009",
            Self::Unknown(_) => "SR0010",
        }
    }
}

impl From<std::io::Error> for Error {
    fn from(e: std::io::Error) -> Self {
        Self::Io(e.to_string())
    }
}

impl From<serde_json::Error> for Error {
    fn from(e: serde_json::Error) -> Self {
        Self::Unknown(format!("json: {e}"))
    }
}

impl From<toml::de::Error> for Error {
    fn from(e: toml::de::Error) -> Self {
        Self::Config {
            message: e.to_string(),
        }
    }
}
