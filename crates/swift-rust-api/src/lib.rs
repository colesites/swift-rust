//! HTTP request and response helpers shared between the dev server and
//! the production binary.
//!
//! This is the "common layer" — anything that's true regardless of whether
//! you're running in `dev` or `start` mode lives here.

use bytes::Bytes;
use http::{header, HeaderMap, HeaderName, HeaderValue, Method, StatusCode};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use thiserror::Error;
use url::Url;

#[derive(Debug, Error)]
pub enum ApiError {
    #[error("bad request: {0}")]
    BadRequest(String),

    #[error("not found: {0}")]
    NotFound(String),

    #[error("method not allowed: {0}")]
    MethodNotAllowed(String),

    #[error("internal: {0}")]
    Internal(String),

    #[error("io: {0}")]
    Io(#[from] std::io::Error),
}

impl ApiError {
    pub fn status(&self) -> StatusCode {
        match self {
            Self::BadRequest(_) => StatusCode::BAD_REQUEST,
            Self::NotFound(_) => StatusCode::NOT_FOUND,
            Self::MethodNotAllowed(_) => StatusCode::METHOD_NOT_ALLOWED,
            Self::Internal(_) | Self::Io(_) => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }
}

impl axum::response::IntoResponse for ApiError {
    fn into_response(self) -> axum::response::Response {
        let status = self.status();
        let body = serde_json::json!({
            "error": {
                "status": status.as_u16(),
                "message": self.to_string(),
            }
        });
        (status, axum::Json(body)).into_response()
    }
}

#[derive(Debug, Clone)]
pub struct RequestContext {
    pub method: Method,
    pub path: String,
    pub query: HashMap<String, String>,
    pub headers: HeaderMap,
    pub cookies: HashMap<String, String>,
    pub body: Option<Bytes>,
}

impl RequestContext {
    pub fn from_parts(
        method: Method,
        uri: &str,
        headers: HeaderMap,
        body: Option<Bytes>,
    ) -> Result<Self, ApiError> {
        let parsed = Url::parse(&format!("http://internal{uri}"))
            .map_err(|e| ApiError::BadRequest(e.to_string()))?;
        let path = parsed.path().to_string();
        let query: HashMap<String, String> = parsed
            .query_pairs()
            .map(|(k, v)| (k.to_string(), v.to_string()))
            .collect();
        let cookie_header = headers
            .get(header::COOKIE)
            .and_then(|v| v.to_str().ok())
            .unwrap_or("");
        let cookies = parse_cookies(cookie_header);
        Ok(Self {
            method,
            path,
            query,
            headers,
            cookies,
            body,
        })
    }

    pub fn header(&self, name: &str) -> Option<&str> {
        self.headers.get(name).and_then(|v| v.to_str().ok())
    }

    pub fn cookie(&self, name: &str) -> Option<&str> {
        self.cookies.get(name).map(String::as_str)
    }
}

fn parse_cookies(raw: &str) -> HashMap<String, String> {
    raw.split(';')
        .filter_map(|p| p.trim().split_once('='))
        .map(|(k, v)| (k.to_string(), v.to_string()))
        .collect()
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct PageResponse {
    pub html: String,
    pub status: u16,
    pub headers: HashMap<String, String>,
}

impl PageResponse {
    pub fn html(html: impl Into<String>) -> Self {
        Self {
            html: html.into(),
            status: 200,
            headers: HashMap::new(),
        }
    }

    pub fn status(mut self, status: u16) -> Self {
        self.status = status;
        self
    }

    pub fn header(mut self, name: impl Into<String>, value: impl Into<String>) -> Self {
        self.headers.insert(name.into(), value.into());
        self
    }
}

impl axum::response::IntoResponse for PageResponse {
    fn into_response(self) -> axum::response::Response {
        let status = StatusCode::from_u16(self.status).unwrap_or(StatusCode::OK);
        let mut headers = HeaderMap::new();
        for (k, v) in self.headers {
            if let (Ok(name), Ok(value)) = (
                HeaderName::from_bytes(k.as_bytes()),
                HeaderValue::from_str(&v),
            ) {
                headers.insert(name, value);
            }
        }
        if !headers.contains_key(header::CONTENT_TYPE) {
            headers.insert(
                header::CONTENT_TYPE,
                HeaderValue::from_static("text/html; charset=utf-8"),
            );
        }
        (status, headers, self.html).into_response()
    }
}

pub fn current_timestamp() -> i64 {
    chrono::Utc::now().timestamp_millis()
}

pub fn short_id() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    let nanos = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_nanos())
        .unwrap_or(0);
    format!("{:x}", nanos & 0xffffffff)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_query_string() {
        let h = HeaderMap::new();
        let ctx = RequestContext::from_parts(Method::GET, "/foo?a=1&b=2", h, None).unwrap();
        assert_eq!(ctx.path, "/foo");
        assert_eq!(ctx.query.get("a").map(String::as_str), Some("1"));
        assert_eq!(ctx.query.get("b").map(String::as_str), Some("2"));
    }

    #[test]
    fn parses_cookies() {
        let mut h = HeaderMap::new();
        h.insert(
            header::COOKIE,
            HeaderValue::from_static("sid=abc; theme=dark"),
        );
        let ctx = RequestContext::from_parts(Method::GET, "/", h, None).unwrap();
        assert_eq!(ctx.cookie("sid"), Some("abc"));
        assert_eq!(ctx.cookie("theme"), Some("dark"));
    }

    #[test]
    fn error_status_codes() {
        assert_eq!(
            ApiError::BadRequest("x".into()).status(),
            StatusCode::BAD_REQUEST
        );
        assert_eq!(
            ApiError::NotFound("x".into()).status(),
            StatusCode::NOT_FOUND
        );
        assert_eq!(
            ApiError::MethodNotAllowed("x".into()).status(),
            StatusCode::METHOD_NOT_ALLOWED
        );
    }
}
