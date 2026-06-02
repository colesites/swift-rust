# Contributing to Swift Rust

Thanks for your interest in contributing. This document covers the basics.

## Code of conduct

By participating, you agree to abide by the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Getting started

1. Fork the repo and clone your fork.
2. Install prerequisites: Bun 1.3+, Rust 1.80+, `wasm32-unknown-unknown` target if working on the runtime.
3. Run `bun install` to install JS dependencies.
4. Run `bun run build:rust` to confirm the Rust workspace compiles.

## Development workflow

1. Create a feature branch from `canary`.
2. Make your changes. Follow the conventions in [AGENTS.md](./AGENTS.md).
3. Add a changeset with `bunx changeset`.
4. Run the full test suite: `bun run test && bun run test:rust`.
5. Open a pull request against `canary`.

## Reporting bugs

Open a GitHub issue with a minimal reproduction. Include the swift-rust version, OS, and full error output.

## Proposing features

Open a GitHub discussion first. Large features should go through a Request for Comments (RFC) in `docs/rfcs/`.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
