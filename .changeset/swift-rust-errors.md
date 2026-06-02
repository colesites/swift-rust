---
"errors": major
---

Add 140 new error documentation files to `errors/docs/`, mapping every applicable Next.js error to a Swift-Rust `SR####` code (SR0011–SR0150).

Each new file follows the upgraded format with seven body sections — Why, Reproducing, Error output, How to fix, Diagnosis, Common pitfalls, See also — beyond the original Next.js structure. Every frontmatter block now carries `severity`, `since`, and `related` in addition to the existing fields.

The schema (`errors/schema.json`) gains the three new optional fields with validation, and `errors/sync.mjs` now verifies required body sections, category enums, severity enums, and `related` references in addition to the existing filename and code checks. The internal `errors/_mapping.json` documents the per-entry skip reasons for the 95 Next.js errors that are Vercel-platform-specific or do not apply to Swift-Rust (legacy Pages Router, getServerSideProps, getStaticProps, _document, _app, Head, Router, Script, styled-jsx, edge runtime, serverless, webpack).
