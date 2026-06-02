# docs

The Swift Rust documentation site, written in swift-rust itself. Lives at https://swift-rust.dev once deployed.

## Layout

```
docs/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── getting-started/
│   │   └── page.tsx
│   ├── components/
│   │   ├── image/page.tsx
│   │   ├── font/page.tsx
│   │   └── pdf/page.tsx
│   └── docs/[...slug]/page.tsx
├── public/
└── swift-rust.config.json
```

## Local development

```bash
bun install
bun --filter swift-rust-docs dev
```

The site runs on port 3001.
