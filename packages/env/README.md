# @swift-rust/env

Loads `.env*` files into `process.env` at server startup and provides helpers for the `SWIFT_RUST_PUBLIC_*` convention used to expose safe-to-inline values to client code.

## Usage

```ts
import { loadPublicEnv, publicEnvKey } from "@swift-rust/env";

loadPublicEnv();
// or
import { loadEnvFiles } from "@swift-rust/env/load";
loadEnvFiles();
```
