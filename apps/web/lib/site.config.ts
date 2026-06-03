/**
 * Single source of truth for external URLs.
 *
 * Override any of these at build time with environment variables (e.g. in the
 * Vercel dashboard or a local .env). When unset, the production fallbacks below
 * are used, so the site works out of the box.
 */
export const siteConfig = {
  /** Marketing / main site. */
  url: process.env.SWIFT_RUST_SITE_URL ?? "https://swift-rust-self.vercel.app",
  /** Documentation site. */
  docsUrl: process.env.SWIFT_RUST_DOCS_URL ?? "https://docs-swift-rust.vercel.app",
  /** Source repository. */
  githubUrl: process.env.SWIFT_RUST_GITHUB_URL ?? "https://github.com/colesites/swift-rust",
} as const;
