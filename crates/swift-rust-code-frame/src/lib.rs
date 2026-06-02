//! Source code frame extraction for fast, beautiful error messages.
//!
//! Given a source file, a line, and a column, produce a human-readable
//! "frame" like this:
//!
//! ```text
//!  1 │ export function hello() {
//!    │                        ^
//!  2 │   console.log("hi")
//!  3 │ }
//! ```
//!
//! This is the same format Rust's `rustc` uses for compile errors.
//! The output is `String` so it can be embedded in HTML, ANSI-colored
//! for the terminal, or wrapped in JSON for an API response.

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Location {
    pub line: u32,
    pub column: u32,
}

impl Location {
    pub fn new(line: u32, column: u32) -> Self {
        Self { line, column }
    }
}

#[derive(Debug, Clone)]
pub struct CodeFrame {
    pub file_name: String,
    pub start_line: u32,
    pub lines: Vec<FrameLine>,
    pub gutter_width: usize,
}

#[derive(Debug, Clone)]
pub struct FrameLine {
    pub number: u32,
    pub content: String,
    pub is_target: bool,
}

#[derive(Debug, Clone, Copy, Default)]
pub struct Style {
    pub use_color: bool,
}

#[derive(thiserror::Error, Debug)]
pub enum FrameError {
    #[error("file not found: {0}")]
    FileNotFound(String),

    #[error("line {0} out of range (file has {1} lines)")]
    LineOutOfRange(u32, u32),

    #[error("io: {0}")]
    Io(#[from] std::io::Error),
}

pub fn extract(
    source: &str,
    file_name: impl Into<String>,
    location: Location,
    context: u32,
) -> Result<CodeFrame, FrameError> {
    let lines: Vec<&str> = source.lines().collect();
    let total = lines.len() as u32;
    if location.line < 1 || location.line > total {
        return Err(FrameError::LineOutOfRange(location.line, total));
    }

    let start = location.line.saturating_sub(1 + context);
    let end = (location.line + context).min(total);
    let mut out = Vec::with_capacity((end - start) as usize);
    for line_idx in start..end {
        out.push(FrameLine {
            number: line_idx + 1,
            content: lines
                .get(line_idx as usize)
                .copied()
                .unwrap_or("")
                .to_string(),
            is_target: line_idx + 1 == location.line,
        });
    }

    let last_line = end;
    let gutter_width = last_line.to_string().len();

    Ok(CodeFrame {
        file_name: file_name.into(),
        start_line: start + 1,
        lines: out,
        gutter_width,
    })
}

pub fn render_plain(frame: &CodeFrame, location: &Location) -> String {
    let mut out = String::new();
    out.push_str(&format!(
        "--> {}:{}:{}\n",
        frame.file_name, location.line, location.column
    ));
    for line in &frame.lines {
        let gutter = format!("{:>width$} | ", line.number, width = frame.gutter_width);
        out.push_str(&gutter);
        out.push_str(&line.content);
        out.push('\n');
        if line.is_target {
            let pad = " ".repeat(frame.gutter_width + 3);
            let col = location.column.saturating_sub(1) as usize;
            let visual_col =
                unicode_width::UnicodeWidthStr::width(&line.content[..col.min(line.content.len())]);
            out.push_str(&pad);
            out.push_str(&" ".repeat(visual_col));
            out.push_str("^\n");
        }
    }
    out
}

pub fn render_ansi(frame: &CodeFrame, location: &Location) -> String {
    const CYAN: &str = "\x1b[36m";
    const RED: &str = "\x1b[31m";
    const BOLD_RED: &str = "\x1b[1;31m";
    const DIM: &str = "\x1b[2m";
    const RESET: &str = "\x1b[0m";

    let mut out = String::new();
    out.push_str(&format!(
        "{CYAN}--> {RESET}{}:{}{CYAN}:{}{RESET}\n",
        frame.file_name, location.line, location.column
    ));
    for line in &frame.lines {
        let gutter_color = if line.is_target { BOLD_RED } else { DIM };
        let gutter = format!(
            "{g}{:>width$} | {r}",
            line.number,
            width = frame.gutter_width,
            g = gutter_color,
            r = RESET
        );
        out.push_str(&gutter);
        out.push_str(&line.content);
        out.push('\n');
        if line.is_target {
            let pad = " ".repeat(frame.gutter_width + 3);
            let col = location.column.saturating_sub(1) as usize;
            let visual_col =
                unicode_width::UnicodeWidthStr::width(&line.content[..col.min(line.content.len())]);
            out.push_str(&pad);
            out.push_str(&format!("{RED}{}^{RESET}", " ".repeat(visual_col)));
            out.push('\n');
        }
    }
    out
}

pub fn render_html(frame: &CodeFrame, location: &Location) -> String {
    let mut out = String::new();
    out.push_str(&format!(
        r#"<div class="code-frame" data-file="{}" data-line="{}" data-column="{}">"#,
        html_escape(&frame.file_name),
        location.line,
        location.column
    ));
    for line in &frame.lines {
        let cls = if line.is_target {
            "code-line is-target"
        } else {
            "code-line"
        };
        out.push_str(&format!(
            r#"<div class="{}"><span class="gutter">{:>width$}</span><span class="source">{}</span></div>"#,
            cls,
            line.number,
            html_escape(&line.content),
            width = frame.gutter_width
        ));
    }
    if location.column > 0 {
        let pad = " ".repeat(frame.gutter_width + 1);
        out.push_str(&format!(
            r#"<div class="code-caret">{}<span class="caret">^</span></div>"#,
            pad
        ));
    }
    out.push_str("</div>");
    out
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
    fn extracts_around_target_line() {
        let src = "a\nb\nc\nd\ne";
        let f = extract(src, "test.ts", Location::new(3, 2), 1).unwrap();
        assert_eq!(f.lines.len(), 3);
        assert_eq!(f.lines[1].number, 3);
        assert!(f.lines[1].is_target);
    }

    #[test]
    fn errors_on_out_of_range() {
        let r = extract("a\nb", "x", Location::new(10, 1), 1);
        assert!(r.is_err());
    }

    #[test]
    fn renders_plain_text() {
        let src = "line1\nline2 has bug\nline3";
        let f = extract(src, "f.ts", Location::new(2, 12), 1).unwrap();
        let s = render_plain(&f, &Location::new(2, 12));
        assert!(s.contains("line2 has bug"));
        assert!(s.contains("^"));
    }
}
