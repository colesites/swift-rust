//! Build-pipeline tests as a library.
//!
//! Lets other crates pull the build test suite in as a dependency, so
//! when we change the build pipeline we can run the full regression
//! suite from one place.

use std::path::Path;

use swift_rust_build::{BuildConfig, BuildInput, BuildOutput, BuildPipeline, BuildTarget};
use swift_rust_core::RenderMode;

type PopulateFn = Box<dyn Fn(&Path) -> std::io::Result<()>>;
type AssertFn = Box<dyn Fn(&BuildOutput) -> Result<(), String>>;

/// Run the full build-pipeline test suite against `root`. Returns the
/// number of tests that failed.
pub fn run_suite(root: &Path) -> usize {
    let mut failures = 0;
    for case in cases() {
        let case_root = root.join(&case.name);
        std::fs::create_dir_all(&case_root).ok();
        if let Err(e) = (case.populate)(&case_root) {
            eprintln!("[{}] populate failed: {e}", case.name);
            failures += 1;
            continue;
        }
        let pipeline = BuildPipeline::new(BuildConfig::default());
        let result = pipeline.build(BuildInput {
            project_root: case_root,
            mode: RenderMode::Ssr,
            target: BuildTarget::Development,
        });
        match result {
            Ok(out) => {
                if let Err(e) = (case.assert)(&out) {
                    eprintln!("[{}] assert failed: {e}", case.name);
                    failures += 1;
                }
            }
            Err(e) => {
                eprintln!("[{}] build failed: {e}", case.name);
                failures += 1;
            }
        }
    }
    failures
}

pub struct TestCase {
    pub name: String,
    pub populate: PopulateFn,
    pub assert: AssertFn,
}

pub fn cases() -> Vec<TestCase> {
    vec![
        TestCase {
            name: "empty_project".to_string(),
            populate: Box::new(|root| {
                std::fs::create_dir_all(root.join("app"))?;
                Ok(())
            }),
            assert: Box::new(|out| {
                if !out.routes.pages.is_empty() {
                    return Err("expected no pages".into());
                }
                Ok(())
            }),
        },
        TestCase {
            name: "single_page".to_string(),
            populate: Box::new(|root| {
                std::fs::create_dir_all(root.join("app"))?;
                std::fs::write(
                    root.join("app/page.tsx"),
                    "export default function Home() { return <h1>Hi</h1>; }",
                )?;
                Ok(())
            }),
            assert: Box::new(|out| {
                if out.routes.pages.len() != 1 {
                    return Err(format!("expected 1 page, got {}", out.routes.pages.len()));
                }
                if out.routes.pages[0].pattern != "/" {
                    return Err(format!("expected /, got {}", out.routes.pages[0].pattern));
                }
                Ok(())
            }),
        },
    ]
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::TempDir;

    #[test]
    fn suite_runs_clean() {
        let dir = TempDir::new().unwrap();
        let failures = run_suite(dir.path());
        assert_eq!(failures, 0, "build-pipeline test suite had failures");
    }
}
