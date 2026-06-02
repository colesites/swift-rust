# @swift-rust/codemod

Automated refactors for swift-rust projects. Run from the CLI to upgrade code between major versions, replace deprecated APIs, and apply framework-specific patterns.

## Built-in transforms

- `img-to-image` — replaces `<img>` tags with `<Image>` from `swift-rust/image`.

## Usage

```ts
import { runCodemod, imgToImage } from "@swift-rust/codemod";

const result = runCodemod(imgToImage, "app");
console.log(`changed ${result.changed} files`);
```
