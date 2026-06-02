use std::path::PathBuf;

use thiserror::Error;

pub type Result<T> = std::result::Result<T, Error>;

#[derive(Debug, Clone)]
pub struct Output {
    pub files: Vec<PathBuf>,
    pub manifest: serde_json::Value,
    pub out_dir: PathBuf,
}

impl Output {
    pub fn empty(out_dir: PathBuf) -> Self {
        Self {
            files: Vec::new(),
            manifest: serde_json::json!({ "version": env!("CARGO_PKG_VERSION") }),
            out_dir,
        }
    }
}

#[derive(Debug, Error)]
pub enum Error {
    #[error("bundling error: {0}")]
    Bundling(String),

    #[error("io error at {path}: {source}")]
    Io {
        path: PathBuf,
        #[source]
        source: std::io::Error,
    },

    #[error("watcher error: {0}")]
    Watcher(#[from] notify::Error),

    #[error("debouncer error: {0}")]
    Debouncer(String),

    #[error("loader `{loader}` failed for {path}: {message}")]
    Loader {
        loader: String,
        path: PathBuf,
        message: String,
    },

    #[error("config error: {0}")]
    Config(String),

    #[error("graph error: {0}")]
    Graph(String),

    #[error("compress error: {0}")]
    Compress(String),
}

impl From<swift_rust_errors::Error> for Error {
    fn from(e: swift_rust_errors::Error) -> Self {
        match e {
            swift_rust_errors::Error::Bundling { message } => Error::Bundling(message),
            swift_rust_errors::Error::Io(s) => Error::Io {
                path: PathBuf::new(),
                source: std::io::Error::other(s),
            },
            other => Error::Bundling(other.to_string()),
        }
    }
}

impl From<std::io::Error> for Error {
    fn from(e: std::io::Error) -> Self {
        Error::Io {
            path: PathBuf::new(),
            source: e,
        }
    }
}

impl From<walkdir::Error> for Error {
    fn from(e: walkdir::Error) -> Self {
        Error::Bundling(e.to_string())
    }
}

impl From<notify_debouncer_mini::DebounceEventResult> for Error {
    fn from(value: notify_debouncer_mini::DebounceEventResult) -> Self {
        match value {
            Ok(_) => Error::Graph("debouncer produced an unexpected Ok".into()),
            Err(e) => Error::Debouncer(e.to_string()),
        }
    }
}
