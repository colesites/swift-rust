import { DocArticle } from "@/app/components/doc-article";

export default function DocsIndexPage() {
  return (
    <DocArticle>
      <h1>Introduction</h1>
      <p>
        Swift Rust is a full-stack React framework powered with Rust + Bun that combines the
        developer experience of Next.js with the performance and safety of Rust. Write your app in
        TSX, render with a Rust core, and ship a single statically-linked binary — 10x faster than
        Next.js.
      </p>

      <h2>What you'll build</h2>
      <p>
        This is a complete framework, not a renderer. It includes routing, layouts, data fetching,
        image and font optimization, video embeds, PDF generation, error handling, metadata, code
        splitting, and a CLI for scaffolding and adding components.
      </p>

      <div className="grid grid-2" style={{ marginTop: "2rem" }}>
        <a href="/docs/getting-started/installation" className="feature-card">
          <h3>Get started →</h3>
          <p>Install the CLI, scaffold your first project, and run the dev server in 60 seconds.</p>
        </a>
        <a href="/docs/api-reference/components/image" className="feature-card">
          <h3>API reference</h3>
          <p>
            Every component, hook, and configuration option, with examples and TypeScript types.
          </p>
        </a>
      </div>

      <h2>Why a new framework?</h2>
      <p>
        We love Next.js's developer experience — the file-based routing, the layout system, the data
        fetching primitives. But we wanted to ship a single binary with no Node.js runtime, and we
        wanted to keep the option of full-WASM SPAs without a different framework. Swift Rust is the
        result.
      </p>

      <h2>Key features</h2>
      <ul>
        <li>
          <strong>Four rendering modes</strong>: pure SSR, SSR with WASM hydration, SSR with HTMX,
          and full WASM SPAs.
        </li>
        <li>
          <strong>2,071 Google fonts</strong> with automatic subsetting and <code>size-adjust</code>{" "}
          fallbacks.
        </li>
        <li>
          <strong>Image component</strong> with AVIF/WebP, responsive <code>srcset</code>, and lazy
          loading.
        </li>
        <li>
          <strong>Video component</strong> with HTML5, YouTube, Vimeo, lightbox, and background
          video modes.
        </li>
        <li>
          <strong>PDF component</strong> with declarative <code>&lt;Document&gt;</code>,{" "}
          <code>&lt;Page&gt;</code>, <code>&lt;Text&gt;</code>, <code>&lt;View&gt;</code>.
        </li>
        <li>
          <strong>35 shadcn-style components</strong> added with one CLI command:{" "}
          <code>swift-rust-ui add button card input</code>.
        </li>
        <li>
          <strong>Single binary deploy</strong>: <code>swift-rust build</code> produces one
          statically-linked Linux binary.
        </li>
      </ul>

      <h2>Next steps</h2>
      <p>
        Continue to <a href="/docs/getting-started/installation">Installation</a> to scaffold your
        first project.
      </p>
    </DocArticle>
  );
}
