//! Video provider detection, embed-URL building, and server-side HTML for the
//! `<Video>` component.
//!
//! This is the Rust counterpart to the `@swift-rust/video` package, mirroring
//! `crates/image` / `crates/pdf`. The compiler and server use it to detect a
//! source's provider, validate IDs, build privacy-preserving embed URLs, and
//! render the markup at SSR time — no client JavaScript required for the embed.

use serde::{Deserialize, Serialize};

const YOUTUBE_HOSTS: &[&str] = &[
    "youtube.com",
    "www.youtube.com",
    "m.youtube.com",
    "youtube-nocookie.com",
    "www.youtube-nocookie.com",
];
const VIMEO_HOSTS: &[&str] = &["vimeo.com", "www.vimeo.com", "player.vimeo.com"];

/// Which player a source resolves to.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum VideoProvider {
    Html5,
    YouTube,
    Vimeo,
}

fn parse(url: &str) -> Option<url::Url> {
    url::Url::parse(url).ok()
}

fn host(u: &url::Url) -> &str {
    u.host_str().unwrap_or("")
}

/// A valid YouTube video id: exactly 11 chars of `[A-Za-z0-9_-]`.
fn is_youtube_id(s: &str) -> bool {
    s.len() == 11 && s.bytes().all(|b| b.is_ascii_alphanumeric() || b == b'_' || b == b'-')
}

/// A valid Vimeo video id: 6 or more ASCII digits.
fn is_vimeo_id(s: &str) -> bool {
    s.len() >= 6 && s.bytes().all(|b| b.is_ascii_digit())
}

pub fn is_youtube_url(url: &str) -> bool {
    match parse(url) {
        Some(u) => host(&u) == "youtu.be" || YOUTUBE_HOSTS.contains(&host(&u)),
        None => false,
    }
}

pub fn is_vimeo_url(url: &str) -> bool {
    match parse(url) {
        Some(u) => VIMEO_HOSTS.contains(&host(&u)),
        None => false,
    }
}

pub fn get_youtube_id(input: &str) -> Option<String> {
    if input.is_empty() {
        return None;
    }
    if is_youtube_id(input) {
        return Some(input.to_string());
    }
    let u = parse(input)?;
    let h = host(&u);
    let path = u.path();
    if h == "youtu.be" {
        let id = path.trim_start_matches('/').split('/').next().unwrap_or("");
        return is_youtube_id(id).then(|| id.to_string());
    }
    if YOUTUBE_HOSTS.contains(&h) {
        if let Some(rest) = path.strip_prefix("/embed/") {
            let id = rest.split('/').next().unwrap_or("");
            return is_youtube_id(id).then(|| id.to_string());
        }
        if let Some(rest) = path.strip_prefix("/shorts/") {
            let id = rest.split('/').next().unwrap_or("");
            return is_youtube_id(id).then(|| id.to_string());
        }
        if let Some((_, v)) = u.query_pairs().find(|(k, _)| k == "v") {
            if is_youtube_id(&v) {
                return Some(v.into_owned());
            }
        }
    }
    None
}

pub fn get_vimeo_id(input: &str) -> Option<String> {
    if input.is_empty() {
        return None;
    }
    if is_vimeo_id(input) {
        return Some(input.to_string());
    }
    let u = parse(input)?;
    if VIMEO_HOSTS.contains(&host(&u)) {
        for seg in u.path().split('/') {
            if !seg.is_empty() && seg.bytes().all(|b| b.is_ascii_digit()) {
                return Some(seg.to_string());
            }
        }
    }
    None
}

pub fn detect_provider(src: &str) -> VideoProvider {
    if is_youtube_url(src) {
        VideoProvider::YouTube
    } else if is_vimeo_url(src) {
        VideoProvider::Vimeo
    } else {
        VideoProvider::Html5
    }
}

/// Options for a YouTube embed. Mirrors the TS `getYouTubeEmbedUrl` defaults
/// (`modest_branding` defaults to true).
#[derive(Debug, Clone)]
pub struct YouTubeEmbedOptions {
    pub auto_play: bool,
    pub controls: bool,
    pub mute: bool,
    pub loop_: bool,
    pub modest_branding: bool,
    pub start: Option<u32>,
    pub end: Option<u32>,
}

impl Default for YouTubeEmbedOptions {
    fn default() -> Self {
        Self {
            auto_play: false,
            controls: true,
            mute: false,
            loop_: false,
            modest_branding: true,
            start: None,
            end: None,
        }
    }
}

pub fn youtube_embed_url(id: &str, opts: &YouTubeEmbedOptions) -> String {
    let mut params: Vec<(String, String)> = vec![("rel".into(), "0".into())];
    if opts.auto_play {
        params.push(("autoplay".into(), "1".into()));
    }
    if opts.mute {
        params.push(("mute".into(), "1".into()));
    }
    if opts.loop_ {
        params.push(("loop".into(), "1".into()));
        params.push(("playlist".into(), id.into()));
    }
    if !opts.controls {
        params.push(("controls".into(), "0".into()));
    }
    if opts.modest_branding {
        params.push(("modestbranding".into(), "1".into()));
    }
    if let Some(s) = opts.start {
        params.push(("start".into(), s.to_string()));
    }
    if let Some(e) = opts.end {
        params.push(("end".into(), e.to_string()));
    }
    format!("https://www.youtube-nocookie.com/embed/{id}?{}", query(&params))
}

/// Options for a Vimeo embed. `muted` defaults to true.
#[derive(Debug, Clone)]
pub struct VimeoEmbedOptions {
    pub auto_play: bool,
    pub muted: bool,
    pub loop_: bool,
    pub title: bool,
    pub byline: bool,
    pub portrait: bool,
}

impl Default for VimeoEmbedOptions {
    fn default() -> Self {
        Self {
            auto_play: false,
            muted: true,
            loop_: false,
            title: true,
            byline: true,
            portrait: true,
        }
    }
}

pub fn vimeo_embed_url(id: &str, opts: &VimeoEmbedOptions) -> String {
    let mut params: Vec<(String, String)> = vec![("dnt".into(), "1".into())];
    if opts.auto_play {
        params.push(("autoplay".into(), "1".into()));
    }
    if opts.muted {
        params.push(("muted".into(), "1".into()));
    }
    if opts.loop_ {
        params.push(("loop".into(), "1".into()));
    }
    if !opts.title {
        params.push(("title".into(), "0".into()));
    }
    if !opts.byline {
        params.push(("byline".into(), "0".into()));
    }
    if !opts.portrait {
        params.push(("portrait".into(), "0".into()));
    }
    format!("https://player.vimeo.com/video/{id}?{}", query(&params))
}

fn query(params: &[(String, String)]) -> String {
    params
        .iter()
        .map(|(k, v)| format!("{k}={v}"))
        .collect::<Vec<_>>()
        .join("&")
}

pub fn infer_mime_type(src: &str) -> &'static str {
    let ext = src
        .rsplit('/')
        .next()
        .unwrap_or("")
        .rsplit('.')
        .next()
        .unwrap_or("")
        .split('?')
        .next()
        .unwrap_or("")
        .to_ascii_lowercase();
    match ext.as_str() {
        "mp4" => "video/mp4",
        "webm" => "video/webm",
        "ogg" | "ogv" => "video/ogg",
        "mov" => "video/quicktime",
        "m4v" => "video/x-m4v",
        _ => "application/octet-stream",
    }
}

/// Props for the `<Video>` component, mirroring the TS surface.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VideoProps {
    pub src: String,
    #[serde(default)]
    pub title: Option<String>,
    #[serde(default)]
    pub aspect_ratio: Option<String>,
    #[serde(default)]
    pub auto_play: bool,
    #[serde(default)]
    pub class_name: Option<String>,
}

fn html_escape(s: &str) -> String {
    s.replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
}

/// Render server-side markup for a video. YouTube/Vimeo sources become a
/// privacy-preserving iframe; everything else becomes a native `<video>`.
pub fn render_html(props: &VideoProps) -> String {
    let title = props.title.clone().unwrap_or_else(|| "Video".to_string());
    let class_attr = props
        .class_name
        .as_deref()
        .map(|c| format!(" class=\"{}\"", html_escape(c)))
        .unwrap_or_default();
    let style = props
        .aspect_ratio
        .as_deref()
        .map(|a| format!(" style=\"aspect-ratio:{};width:100%;border:0\"", html_escape(a)))
        .unwrap_or_else(|| " style=\"width:100%;border:0\"".to_string());

    match detect_provider(&props.src) {
        VideoProvider::YouTube => {
            let id = get_youtube_id(&props.src).unwrap_or_default();
            let opts = YouTubeEmbedOptions {
                auto_play: props.auto_play,
                mute: props.auto_play,
                ..Default::default()
            };
            let src = youtube_embed_url(&id, &opts);
            format!(
                "<iframe src=\"{}\" title=\"{}\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" allowfullscreen{}{}></iframe>",
                html_escape(&src), html_escape(&title), class_attr, style
            )
        }
        VideoProvider::Vimeo => {
            let id = get_vimeo_id(&props.src).unwrap_or_default();
            let opts = VimeoEmbedOptions {
                auto_play: props.auto_play,
                ..Default::default()
            };
            let src = vimeo_embed_url(&id, &opts);
            format!(
                "<iframe src=\"{}\" title=\"{}\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen{}{}></iframe>",
                html_escape(&src), html_escape(&title), class_attr, style
            )
        }
        VideoProvider::Html5 => {
            let mime = infer_mime_type(&props.src);
            let autoplay = if props.auto_play { " autoplay muted" } else { "" };
            format!(
                "<video controls{}{}{}><source src=\"{}\" type=\"{}\" />Your browser does not support the video tag.</video>",
                autoplay, class_attr, style, html_escape(&props.src), mime
            )
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn detects_youtube_hosts_and_short_urls() {
        assert!(is_youtube_url("https://youtu.be/rTJzsHwpZko"));
        assert!(is_youtube_url("https://www.youtube.com/watch?v=rTJzsHwpZko"));
        assert!(is_youtube_url("https://www.youtube-nocookie.com/embed/rTJzsHwpZko"));
        assert!(!is_youtube_url("https://example.com/clip.mp4"));
        assert!(!is_youtube_url("not-a-url"));
    }

    #[test]
    fn extracts_youtube_id_from_every_form() {
        assert_eq!(get_youtube_id("rTJzsHwpZko").as_deref(), Some("rTJzsHwpZko"));
        assert_eq!(
            get_youtube_id("https://youtu.be/rTJzsHwpZko?si=x").as_deref(),
            Some("rTJzsHwpZko")
        );
        assert_eq!(
            get_youtube_id("https://www.youtube.com/watch?v=rTJzsHwpZko").as_deref(),
            Some("rTJzsHwpZko")
        );
        assert_eq!(
            get_youtube_id("https://www.youtube.com/shorts/rTJzsHwpZko").as_deref(),
            Some("rTJzsHwpZko")
        );
        assert_eq!(
            get_youtube_id("https://www.youtube.com/embed/rTJzsHwpZko").as_deref(),
            Some("rTJzsHwpZko")
        );
        assert_eq!(get_youtube_id("https://example.com/x"), None);
    }

    #[test]
    fn extracts_vimeo_id() {
        assert!(is_vimeo_url("https://vimeo.com/76979871"));
        assert_eq!(get_vimeo_id("https://vimeo.com/76979871").as_deref(), Some("76979871"));
        assert_eq!(get_vimeo_id("76979871").as_deref(), Some("76979871"));
        assert_eq!(get_vimeo_id("https://youtu.be/rTJzsHwpZko"), None);
    }

    #[test]
    fn detect_provider_classifies() {
        assert_eq!(detect_provider("https://youtu.be/rTJzsHwpZko"), VideoProvider::YouTube);
        assert_eq!(detect_provider("https://vimeo.com/76979871"), VideoProvider::Vimeo);
        assert_eq!(detect_provider("https://example.com/clip.mp4"), VideoProvider::Html5);
    }

    #[test]
    fn youtube_embed_url_matches_ts_defaults() {
        let url = youtube_embed_url("rTJzsHwpZko", &YouTubeEmbedOptions::default());
        assert!(url.starts_with("https://www.youtube-nocookie.com/embed/rTJzsHwpZko?"));
        assert!(url.contains("rel=0"));
        assert!(url.contains("modestbranding=1"));
        assert!(!url.contains("autoplay"));

        let auto = youtube_embed_url(
            "rTJzsHwpZko",
            &YouTubeEmbedOptions { auto_play: true, mute: true, ..Default::default() },
        );
        assert!(auto.contains("autoplay=1"));
        assert!(auto.contains("mute=1"));
    }

    #[test]
    fn vimeo_embed_url_defaults_muted() {
        let url = vimeo_embed_url("76979871", &VimeoEmbedOptions::default());
        assert!(url.starts_with("https://player.vimeo.com/video/76979871?"));
        assert!(url.contains("dnt=1"));
        assert!(url.contains("muted=1"));
    }

    #[test]
    fn infer_mime_type_by_extension() {
        assert_eq!(infer_mime_type("/clip.mp4"), "video/mp4");
        assert_eq!(infer_mime_type("https://x.com/a.webm?t=1"), "video/webm");
        assert_eq!(infer_mime_type("/movie.mov"), "video/quicktime");
        assert_eq!(infer_mime_type("/unknown.xyz"), "application/octet-stream");
    }

    #[test]
    fn render_html_youtube_is_iframe() {
        let html = render_html(&VideoProps {
            src: "https://youtu.be/rTJzsHwpZko".into(),
            title: Some("Demo".into()),
            aspect_ratio: Some("16 / 9".into()),
            auto_play: false,
            class_name: Some("rounded".into()),
        });
        assert!(html.contains("<iframe"));
        assert!(html.contains("youtube-nocookie.com/embed/rTJzsHwpZko"));
        assert!(html.contains("aspect-ratio:16 / 9"));
        assert!(html.contains("class=\"rounded\""));
    }

    #[test]
    fn render_html_file_is_video_tag() {
        let html = render_html(&VideoProps {
            src: "/clip.mp4".into(),
            title: None,
            aspect_ratio: None,
            auto_play: true,
            class_name: None,
        });
        assert!(html.contains("<video controls autoplay muted"));
        assert!(html.contains("type=\"video/mp4\""));
    }
}
