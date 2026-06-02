# swift-rust-errors

Centralized error types and codes for the Swift Rust framework. Every public API returns a `Result<T, Error>` where `Error` is this crate's enum.

## Error codes

| Code   | Variant       | Description                       |
| ------ | ------------- | --------------------------------- |
| SR0001 | `Config`      | Invalid or missing configuration. |
| SR0002 | `Routing`     | File-system routing failure.      |
| SR0003 | `Compilation` | JSX/Rust compile failure.         |
| SR0004 | `Bundling`    | Asset pipeline failure.           |
| SR0005 | `Server`      | HTTP server runtime error.        |
| SR0006 | `Image`       | Image component error.            |
| SR0007 | `Font`        | Font component error.             |
| SR0008 | `Pdf`         | PDF component error.              |
| SR0009 | `Io`          | File-system I/O error.            |
| SR0010 | `Unknown`     | Catch-all. Should not surface.    |
