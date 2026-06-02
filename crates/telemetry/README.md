# swift-rust-telemetry

Tracing and event emission for the framework. Initializes a `tracing` subscriber with environment-driven log levels.

## Usage

```rust
use swift_rust_telemetry;

fn main() -> swift_rust_errors::Result<()> {
    swift_rust_telemetry::init()?;
    Ok(())
}
```

## Log levels

Set `RUST_LOG` to control verbosity. Defaults to `info,swift_rust=debug`.
