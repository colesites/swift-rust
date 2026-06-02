# AGENTS.md

Working agreement for AI coding agents and human contributors working in this repository.

## Repository overview

Swift Rust is a monorepo containing a Rust framework, JS/TS packages, docs, error definitions, scripts, tests, and examples. The two package ecosystems coexist:

- **Rust crates** in `crates/*` — workspace defined in the root `Cargo.toml`.
- **JS/TS packages** in `packages/*`, `docs/`, `scripts/`, `test/`, `examples/*` — workspaces defined in the root `package.json` (Bun).

## Tooling

| Tool    | Purpose                          | Min version |
| ------- | -------------------------------- | ----------- |
| bun     | JS package manager + runtime     | 1.3.0       |
| turbo   | Task runner and caching          | 2.1.0       |
| cargo   | Rust build + test                | 1.85        |
| rustc   | Compiler                         | 1.85        |

## Common commands

```bash
# Install everything
bun install

# Build all JS packages
bun run build

# Build all Rust crates (main workspace; excludes crates/compiler sub-workspace)
bun run build:rust

# Build the SWC plugin sub-workspace (advanced; requires pinned toolchain)
cd crates/compiler && cargo build

# Run dev (parallel)
bun run dev

# Lint everything
bun run lint

# Type-check JS packages
bun run typecheck

# Run all tests
bun run test

# Run only Rust tests
bun run test:rust

# Format everything
bun run format

# Clean all build outputs
bun run clean
```

## Conventions

### Code style

- **Rust**: `cargo fmt` for formatting, `cargo clippy` for lints. Run `cargo fmt --all && cargo clippy --workspace --all-targets -- -D warnings` before opening a PR.
- **TypeScript**: Biome for formatting and linting. No ESLint config in the root — each package extends `@swift-rust/eslint-config` if it needs lint rules.
- **No comments** in source files unless they are essential API documentation (rustdoc/JSDoc). The codebase should be self-explanatory through naming.

### Naming

- Rust crates: `kebab-case` for directory and crate names, `snake_case` for items.
- JS packages: `kebab-case`, scoped `@swift-rust/*` for published packages, unscoped for private ones (e.g. `create-swift-rust`).
- Public APIs should mirror Next.js naming where possible for familiarity.

### Commit messages

Follow Conventional Commits. Scopes are encouraged: `feat(compiler)`, `fix(server)`, `docs(README)`.

### Changesets

Every user-facing change must include a changeset in `.changeset/`. Run `bunx changeset` to create one.

## Working in subdirectories

- `crates/*` — Standalone Rust crates. Each has its own `Cargo.toml` and `src/`. Add new public APIs to the parent `swift-rust` crate and re-export.
- `packages/*` — JS/TS packages. Each has a `package.json` and follows standard conventions (`src/index.ts` entry, `dist/` output, `tsconfig.json`).
- `docs/` — The documentation site. It's itself a swift-rust app, so use it to dogfood the framework.
- `errors/` — Error code reference. New error codes go in `errors/docs/*.md` and are referenced by code in Rust via the `errors` crate.

## Testing

- Unit tests live next to the code (`#[cfg(test)] mod tests` in Rust, `*.test.ts` in TS).
- Integration tests live in `test/integration/`.
- End-to-end tests live in `test/e2e/` and use Playwright.
- Test fixtures (small example apps used as test inputs) live in `test/fixtures/`.

## Things to watch out for

- **Don't break the workspace** — `cargo build --workspace` and `bun run build` must both succeed at HEAD at all times.
- **Don't commit lockfile changes without updating Cargo.toml** — root `Cargo.toml` is the source of truth for workspace dependency versions.
- **The compiler crate is sacred** — it has its own sub-workspace at `crates/compiler/`. Don't move it without coordinating with the team. It is currently a scaffold stub: `cargo check` from the root workspace does not build it.
- **WASM targets** — Anything that needs to ship to the browser must be `no_std`-compatible and feature-gated.
