use serde::{Deserialize, Serialize};
use swift_rust_config::FontConfig;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FontProps {
    pub family: String,
    pub subsets: Vec<String>,
    pub display: String,
    pub weight: Vec<u16>,
    pub style: Vec<String>,
    pub variable: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoadedFont {
    pub family: String,
    pub subsets: Vec<String>,
    pub css_class: String,
    pub fallback_metrics: FallbackMetrics,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FallbackMetrics {
    pub ascent: f32,
    pub descent: f32,
    pub line_gap: f32,
    pub units_per_em: f32,
    pub x_width_avg: f32,
}

pub struct FontService {
    config: FontConfig,
    db: fontdb::Database,
}

impl Default for FontService {
    fn default() -> Self {
        Self::new()
    }
}

impl FontService {
    pub fn new() -> Self {
        let mut db = fontdb::Database::new();
        db.load_system_fonts();
        Self {
            config: FontConfig::default(),
            db,
        }
    }

    pub fn with_config(config: FontConfig) -> Self {
        let mut s = Self::new();
        s.config = config;
        s
    }

    pub fn class_name(&self, family: &str) -> String {
        let h = blake3::hash(family.as_bytes()).to_hex();
        format!("__swift_rust_font_{}", &h.as_str()[..8])
    }

    pub fn has_system_family(&self, family: &str) -> bool {
        self.db.faces().any(|f| {
            f.families
                .iter()
                .any(|(name, _)| name.eq_ignore_ascii_case(family))
        })
    }

    pub fn google_fonts_url(props: &FontProps) -> String {
        let family = props.family.replace(' ', "+");
        let mut url = format!("https://fonts.googleapis.com/css2?family={family}");
        if !props.weight.is_empty() {
            let w: Vec<String> = props.weight.iter().map(|w| w.to_string()).collect();
            url.push_str(&format!(":wght@{}", w.join(";")));
        }
        for s in &props.subsets {
            url.push_str(&format!("&subset={s}"));
        }
        url.push_str(&format!("&display={}", props.display));
        url
    }

    pub fn render_link(&self, family: &str) -> String {
        format!("<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />\n<link rel=\"stylesheet\" href=\"{}\" />", Self::google_fonts_url(&FontProps {
            family: family.into(), subsets: self.config.subsets.clone(), display: self.config.display.clone(), weight: vec![400, 700], style: vec!["normal".into()], variable: false,
        }))
    }
}

impl LoadedFont {
    pub fn to_style(&self) -> String {
        format!(
            ".__swift_rust_font_{fallback} {{ font-family: '{family}', system-ui, sans-serif; }}",
            family = self.family,
            fallback = self.css_class.trim_start_matches("__swift_rust_font_"),
        )
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn google_url_includes_family() {
        let p = FontProps {
            family: "Inter".into(),
            subsets: vec!["latin".into()],
            display: "swap".into(),
            weight: vec![400],
            style: vec!["normal".into()],
            variable: false,
        };
        let url = FontService::google_fonts_url(&p);
        assert!(url.contains("family=Inter"));
        assert!(url.contains("subset=latin"));
    }
}
