use std::collections::HashMap;
use std::sync::Arc;

use axum::body::Body;
use axum::http::StatusCode;
use axum::routing::get;
use axum::Router as AxumRouter;
use matchit::Router as MatchitRouter;
use serde::{Deserialize, Serialize};
use swift_rust_config::Config;
use swift_rust_errors::Result;
use tokio::sync::RwLock;

pub use axum::http::{Request, Response};

pub type AxumRequest = Request<Body>;
pub type AxumResponse = Response<Body>;

pub struct Router {
    inner: Arc<RwLock<MatchitRouter<RouteHandler>>>,
    config: Arc<Config>,
}

type RouteHandler = Arc<dyn Fn(RouteContext) -> Result<AxumResponse> + Send + Sync>;

#[derive(Clone)]
pub struct RouteContext {
    pub method: String,
    pub path: String,
    pub params: HashMap<String, String>,
    pub query: HashMap<String, String>,
    pub headers: HashMap<String, String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PageProps {
    pub params: HashMap<String, String>,
    pub query: HashMap<String, String>,
    pub url: String,
}

impl Default for Router {
    fn default() -> Self {
        Self::new()
    }
}

impl Router {
    pub fn new() -> Self {
        Self {
            inner: Arc::new(RwLock::new(MatchitRouter::new())),
            config: Arc::new(Config::default()),
        }
    }

    pub fn with_config(config: Config) -> Self {
        Self {
            inner: Arc::new(RwLock::new(MatchitRouter::new())),
            config: Arc::new(config),
        }
    }

    pub async fn add_route<F>(&self, method: &str, path: &str, handler: F) -> Result<()>
    where
        F: Fn(RouteContext) -> Result<AxumResponse> + Send + Sync + 'static,
    {
        let key = format!("{method} {path}");
        let mut router = self.inner.write().await;
        router
            .insert(&key, Arc::new(handler))
            .map_err(|e| swift_rust_errors::Error::Routing {
                message: e.to_string(),
            })?;
        Ok(())
    }

    pub async fn dispatch(&self, req: AxumRequest) -> Result<AxumResponse> {
        let method = req.method().to_string();
        let path = req.uri().path().to_string();
        let key = format!("{method} {path}");
        let router = self.inner.read().await;
        match router.at(&key) {
            Ok(matched) => {
                let params: HashMap<String, String> = matched
                    .params
                    .iter()
                    .map(|(k, v)| (k.to_string(), v.to_string()))
                    .collect();
                let ctx = RouteContext {
                    method,
                    path: path.clone(),
                    params,
                    query: parse_query(req.uri().query().unwrap_or("")),
                    headers: extract_headers(&req),
                };
                (matched.value)(ctx)
            }
            Err(_) => Ok(not_found(&path)),
        }
    }

    pub fn config(&self) -> &Config {
        &self.config
    }
}

fn parse_query(q: &str) -> HashMap<String, String> {
    q.split('&')
        .filter_map(|p| {
            let mut it = p.splitn(2, '=');
            Some((it.next()?.to_string(), it.next()?.to_string()))
        })
        .collect()
}

fn extract_headers(req: &AxumRequest) -> HashMap<String, String> {
    req.headers()
        .iter()
        .map(|(k, v)| (k.to_string(), v.to_str().unwrap_or("").to_string()))
        .collect()
}

fn not_found(path: &str) -> AxumResponse {
    Response::builder()
        .status(StatusCode::NOT_FOUND)
        .body(Body::from(format!("404 not found: {path}")))
        .unwrap()
}

pub async fn start(port: u16) -> Result<()> {
    let app = AxumRouter::new().route("/", get(root));
    let listener = tokio::net::TcpListener::bind(("0.0.0.0", port)).await?;
    tracing::info!(port, "swift-rust server listening");
    axum::serve(listener, app).await?;
    Ok(())
}

pub async fn dev_server(port: u16) -> Result<()> {
    swift_rust_telemetry::init()?;
    tokio::spawn(async move {
        if let Err(e) = swift_rust_bundler::watch().await {
            tracing::error!(error = %e, "bundler watch failed");
        }
    });
    start(port).await
}

pub async fn lint() -> Result<()> {
    tracing::info!("lint not yet implemented");
    Ok(())
}

pub async fn test() -> Result<()> {
    tracing::info!("test runner not yet implemented");
    Ok(())
}

async fn root() -> &'static str {
    "swift-rust"
}
