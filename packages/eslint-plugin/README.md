# @swift-rust/eslint-plugin

Custom ESLint rules for swift-rust.

## Rules

- `@swift-rust/no-img-element` — disallow raw `<img>` tags. Use the `<Image>` component.
- `@swift-rust/no-anchor-target-blank` — require `rel="noopener"` on `<a target="_blank">`.

## Usage

```js
// eslint.config.js
import swiftRustPlugin from "@swift-rust/eslint-plugin";

export default [
  swiftRustPlugin.configs.recommended,
];
```
