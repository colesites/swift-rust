# test

Integration tests for the swift-rust framework (`bun test`).

## Layout

```
test/
├── integration/
│   ├── build.test.ts        # builds fixtures/app, asserts .vercel/output, invokes emitted functions
│   └── dev-server.test.ts   # boots the dev server against fixtures/app, asserts the live route pipeline
├── e2e/home.spec.ts         # Playwright smoke test (needs `playwright install`)
└── fixtures/
    ├── app/                 # feature-rich fixture: static + image/og/fonts, node/[param]/client/slot functions
    ├── basic/  image-heavy/  pdf/
```

## Coverage

`integration/build.test.ts` (build/output path):
- static rendering, `<Image>` → Vercel optimizer (bounded widths), metadata + OpenGraph, image config
- Google font `<link>` + bundled local fonts emitted, client navigator emitted/injected
- function emission: `'use node'` → Node `.func`, `[param]` → one function + config route, `@slot` not a route
- function request pipeline (invoking the bundles): guard opt-in redirect, loader + state + seo,
  `[param]` extraction, `'use client'` island wrapping, parallel `@slot` composition

`integration/dev-server.test.ts` (live dev path):
- runtime resolution headers (`bun` default, `node` + dynamic), opt-in guard redirect,
  `useLoaderData()` rendering, `[param]` resolution, navigator served

## Running

```bash
bun test integration       # integration suite
bun run test:e2e           # Playwright (after `bunx playwright install`)
```
