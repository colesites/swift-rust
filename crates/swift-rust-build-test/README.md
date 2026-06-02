# `swift-rust-build-test`

Build-pipeline tests, packaged as a library.

## Why

So other crates — and CI — can pull the build test suite in as a
dependency, instead of duplicating the fixtures and assertions.

## What's in here

- `run_suite(root)` — runs every test case, returns failure count
- `cases()` — the list of test cases (empty project, single page, …)

## Adding a case

Add a new `TestCase` to `cases()`. Populate the project tree, then
assert against the resulting `BuildOutput`. The runner handles temp
directory creation and teardown.
