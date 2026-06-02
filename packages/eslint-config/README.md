# @swift-rust/eslint-config

Shareable ESLint config used by `create-swift-rust` and the framework's own packages.

## Usage

```js
// eslint.config.js
import swiftRustConfig from "@swift-rust/eslint-config";

export default swiftRustConfig({
  react: "detect",
  typescript: true,
  jsx: true,
});
```
