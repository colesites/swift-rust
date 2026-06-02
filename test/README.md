# test

Integration and end-to-end test suites for the swift-rust framework.

## Layout

```
test/
├── package.json
├── tsconfig.json
├── playwright.config.ts
├── integration/            # Bun test files for cross-package integration
│   ├── build.test.ts
│   ├── dev-server.test.ts
│   └── image.test.ts
├── e2e/                    # Playwright suites against a real dev server
│   ├── home.spec.ts
│   ├── routing.spec.ts
│   └── image.spec.ts
└── fixtures/               # Sample apps used as test inputs
    ├── basic/
    ├── image-heavy/
    └── pdf/
```

## Running

```bash
# All tests
bun run test

# Integration only
bun run test:integration

# E2E only (requires Playwright browsers)
bun run test:e2e
```
