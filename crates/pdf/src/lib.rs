use serde::{Deserialize, Serialize};
use swift_rust_config::PdfConfig;
use swift_rust_errors::Result;

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq, Default)]
#[serde(rename_all = "lowercase")]
pub enum PageSize {
    #[default]
    A4,
    A3,
    Letter,
    Legal,
    Tabloid,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq, Default)]
#[serde(rename_all = "lowercase")]
pub enum Orientation {
    #[default]
    Portrait,
    Landscape,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DocumentProps {
    #[serde(default)]
    pub title: String,
    #[serde(default)]
    pub author: String,
    #[serde(default)]
    pub subject: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PageProps {
    #[serde(default)]
    pub size: PageSize,
    #[serde(default)]
    pub orientation: Orientation,
    #[serde(default)]
    pub margin: f32,
}

impl Default for PageProps {
    fn default() -> Self {
        Self {
            size: PageSize::default(),
            orientation: Orientation::default(),
            margin: 50.0,
        }
    }
}

pub struct DocumentBuilder {
    config: PdfConfig,
    pages: Vec<PageProps>,
}

impl Default for DocumentBuilder {
    fn default() -> Self {
        Self::new()
    }
}

impl DocumentBuilder {
    pub fn new() -> Self {
        Self {
            config: PdfConfig::default(),
            pages: Vec::new(),
        }
    }

    pub fn with_config(config: PdfConfig) -> Self {
        Self {
            config,
            pages: Vec::new(),
        }
    }

    pub fn add_page(&mut self, props: PageProps) -> &mut Self {
        self.pages.push(props);
        self
    }

    pub fn build(&self) -> Result<Vec<u8>> {
        let (doc, page1, layer1) = printpdf::PdfDocument::new(
            &self.config.default_page_size,
            printpdf::Mm(210.0),
            printpdf::Mm(297.0),
            "Layer 1",
        );
        let _current_layer = doc.get_page(page1).get_layer(layer1);
        let bytes = doc
            .save_to_bytes()
            .map_err(|e| swift_rust_errors::Error::Pdf {
                message: e.to_string(),
            })?;
        Ok(bytes)
    }
}

pub type Mm = printpdf::Mm;

impl From<PageSize> for (f32, f32) {
    fn from(p: PageSize) -> Self {
        match p {
            PageSize::A4 => (210.0, 297.0),
            PageSize::A3 => (297.0, 420.0),
            PageSize::Letter => (215.9, 279.4),
            PageSize::Legal => (215.9, 355.6),
            PageSize::Tabloid => (279.4, 431.8),
        }
    }
}

pub fn render_text_layer(text: &str, x: f32, y: f32, font_size: f32) -> String {
    format!("<text x=\"{x}\" y=\"{y}\" font-size=\"{font_size}\">{text}</text>")
}

pub fn render_view(children: &str, x: f32, y: f32, width: f32, height: f32) -> String {
    format!("<view x=\"{x}\" y=\"{y}\" width=\"{width}\" height=\"{height}\">{children}</view>")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn empty_document_produces_bytes() {
        let mut b = DocumentBuilder::new();
        b.add_page(PageProps::default());
        let bytes = b.build().unwrap();
        assert!(!bytes.is_empty());
    }
}
