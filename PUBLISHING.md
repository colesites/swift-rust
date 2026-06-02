# Running the examples

Each example in `examples/` is a tiny swift-rust app. To run one locally:

```bash
# 1. Build the framework binary
cargo build --release -p swift-rust

# 2. Add the binary to PATH (or use a full path)
export PATH="$PWD/target/release:$PATH"

# 3. Install the example's dependencies
cd examples/hello-world
bun install

# 4. Start the dev server
swift-rust dev
```

Open http://localhost:3000.

## Other examples

| Example         | What it shows                                       | Command                                |
| --------------- | --------------------------------------------------- | -------------------------------------- |
| hello-world     | Smallest possible app                               | `cd examples/hello-world && swift-rust dev` |
| with-image      | `<Image>` with a remote source + allowlisted domain | `cd examples/with-image && swift-rust dev` |
| with-pdf        | Server-side PDF generation                          | `cd examples/with-pdf && swift-rust dev`  |

The `test/fixtures/` directory contains the same kind of apps but used as inputs to the integration test suite.

# Publishing to npm

The `swift-rust` package is at `packages/swift-rust/`. It bundles JS/TS exports for the framework plus a JS shim that downloads a prebuilt Rust binary on install.

## One-time setup

```bash
# Log in to npm
bun login

# Create the dist-tag and access
# (only required the first time)
npm owner add your-name swift-rust
```

## Release flow

1. **Bump the version.**

   ```bash
   bunx changeset version
   git commit -am "chore: version packages"
   ```

2. **Build native binaries for every target.**

   ```bash
   bun run packages/swift-rust/scripts/package-native.ts
   ```

   This writes one tarball per target into `packages/swift-rust/native/` plus a `manifest.json` with the SHA-256 of each archive.

3. **Cut a GitHub release.** Upload the artifacts from `packages/swift-rust/native/` to a new release tag matching the version, e.g. `v0.1.0`. The postinstall script downloads from `${RELEASES_URL}/download/v${VERSION}/...`.

4. **Publish the JS package.**

   ```bash
   cd packages/swift-rust
   bun publish
   ```

## What users see

```bash
# New project
bun create swift-rust@latest my-app

# Add to existing project
npm install swift-rust
# or
bun add swift-rust
```

The install step runs `postinstall` which downloads the platform-specific binary to `node_modules/swift-rust/native/<platform>-<arch>/swift-rust`. The `swift-rust` bin is a JS shim that locates and runs the downloaded binary, falling back to `cargo build` if no prebuilt archive is available.

# Scaffolder

The scaffolder is `create-swift-rust` at `packages/create-swift-rust/`. Publish it the same way.

```bash
cd packages/create-swift-rust
bun publish
```

After both packages are on npm:

```bash
bun create swift-rust@latest my-app
```

This is the equivalent of `bun create swift-rust@latest`.
