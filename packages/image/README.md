# @swift-rust/image

The `<Image>` component. Renders an `<img>` with an optimized `srcset`, lazy loading, and an `/_swift-rust/image` URL for on-demand optimization. The Rust bundler/runtime handles the server-side image processing.

## Usage

```tsx
import { Image } from "swift-rust/image";

export default function Hero() {
  return (
    <Image
      src="/hero.jpg"
      width={1200}
      height={600}
      alt="Hero"
      priority
      sizes="100vw"
    />
  );
}
```

> Or import directly from `@swift-rust/image` if you want a smaller install.

## Remote sources

Add the domain to `swift-rust.config.json`:

```json
{
  "image": { "domains": ["cdn.example.com"] }
}
```
