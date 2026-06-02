# swift-rust

The main facade crate and CLI entry point for the Swift Rust framework.

## Commands

```bash
swift-rust dev        # Start dev server (default: :3000)
swift-rust build      # Build for production
swift-rust start      # Start production server
swift-rust lint       # Lint project
swift-rust test       # Run tests
swift-rust info       # Print environment info
```

## Library usage

```rust
use swift_rust::prelude::*;

#[tokio::main]
async fn main() -> Result<()> {
    let config = Config::load()?;
    let app = Router::new();
    Ok(())
}
```
