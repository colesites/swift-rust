use serde::{Deserialize, Serialize};
use swift_rust_config::ImageConfig;
use swift_rust_errors::Result;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ImageProps {
    pub src: String,
    pub width: u32,
    pub height: u32,
    #[serde(default)]
    pub alt: String,
    #[serde(default)]
    pub quality: Option<u8>,
    #[serde(default)]
    pub priority: bool,
    #[serde(default)]
    pub placeholder: Option<String>,
    #[serde(default)]
    pub sizes: Option<String>,
}

pub struct ImageService {
    config: ImageConfig,
}

impl ImageService {
    pub fn new(config: ImageConfig) -> Self {
        Self { config }
    }

    pub fn generate_srcset(&self, src: &str, sizes: &[u32]) -> Result<String> {
        let entries: Vec<String> = sizes.iter().map(|w| format!("{src}?w={w} {w}w")).collect();
        Ok(entries.join(", "))
    }

    pub fn url_for(&self, src: &str, width: u32) -> String {
        format!(
            "/_next/image?url={}&w={}&q=75",
            percent_encoding::utf8_percent_encode(src, percent_encoding::NON_ALPHANUMERIC),
            width
        )
    }

    pub fn allowed(&self, src: &str) -> bool {
        if src.starts_with('/') {
            return true;
        }
        if let Ok(parsed) = url::Url::parse(src) {
            if let Some(host) = parsed.host_str() {
                return self.config.domains.iter().any(|d| d == host);
            }
        }
        false
    }
}

pub fn render_html(props: &ImageProps) -> String {
    let mut attrs = vec![
        format!("src=\"{}\"", html_escape(&props.src)),
        format!("width=\"{}\"", props.width),
        format!("height=\"{}\"", props.height),
    ];
    if !props.alt.is_empty() {
        attrs.push(format!("alt=\"{}\"", html_escape(&props.alt)));
    }
    if props.priority {
        attrs.push("loading=\"eager\"".to_string());
        attrs.push("fetchpriority=\"high\"".to_string());
    } else {
        attrs.push("loading=\"lazy\"".to_string());
    }
    format!("<img {} />", attrs.join(" "))
}

fn html_escape(s: &str) -> String {
    s.replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn render_html_includes_attrs() {
        let p = ImageProps {
            src: "/a.jpg".into(),
            width: 100,
            height: 200,
            alt: "alt".into(),
            quality: None,
            priority: false,
            placeholder: None,
            sizes: None,
        };
        let html = render_html(&p);
        assert!(html.contains("src=\"/a.jpg\""));
        assert!(html.contains("width=\"100\""));
        assert!(html.contains("height=\"200\""));
        assert!(html.contains("alt=\"alt\""));
    }
}
