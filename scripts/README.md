# scripts

Internal build, release, and CI scripts. Invoked from the root `package.json` or from CI workflows.

## Layout

```
scripts/
├── package.json
├── tsconfig.json
├── src/
│   ├── build-native.ts       # Cross-compile the Rust binary for all targets.
│   ├── publish.ts            # Publish packages in dependency order via changesets.
│   ├── test-pack.ts          # Smoke-test a freshly built npm tarball.
│   ├── sync-errors.ts        # Verify crates/errors matches errors/docs.
│   └── version-bump.ts       # Bump versions in the workspace and crates.
```

Each script is a standalone TypeScript file runnable with `bun run scripts/src/<name>.ts`.
