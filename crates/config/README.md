# swift-rust-config

Loads and validates `swift-rust.config.json` / `.toml` / `.yaml` from the project root. Falls back to defaults when no config is present.

## Supported formats

- `swift-rust.config.json`
- `swift-rust.config.toml`
- `swift-rust.config.yaml`

## Schema

```json
{
  "rendering": "ssr-wasm",
  "image": {
    "domains": ["cdn.example.com"],
    "formats": ["image/webp", "image/avif"]
  },
  "font": {
    "subsets": ["latin"],
    "display": "swap"
  },
  "pdf": {
    "defaultPageSize": "A4",
    "defaultOrientation": "portrait"
  }
}
```
