# `swift-rust-core`

Foundation types and traits used across the swift-rust workspace.

- Route segments, route params
- HTTP method enum with `as_str` / `parse`
- Render mode enum
- Asset references
- Workspace-wide error type
- `ProjectInfo` for introspection

Zero business logic on purpose. Every other crate depends on this one.
