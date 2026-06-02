import type { Metadata } from "swift-rust";
import { Link } from "swift-rust";

export const metadata: Metadata = { title: "PDFs" };

const DOCS = [
  { name: "Swift Rust — Architecture overview", size: "12 pages", updated: "2026-05-28" },
  { name: "Migration guide: Next.js to Swift Rust", size: "8 pages", updated: "2026-05-21" },
  { name: "Renderer reference", size: "24 pages", updated: "2026-05-12" },
];

export default function PdfsPage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <p className="text-[0.75rem] font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]">
        Showcase
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">PDFs</h1>
      <p className="mt-4 max-w-2xl text-[var(--color-fg-muted)]">
        Render PDFs at request time. The Pdf component handles layout, fonts, and streaming.
      </p>

      <div className="mt-12 card overflow-hidden">
        <ul className="divide-y divide-[var(--color-border)]">
          {DOCS.map((doc) => (
            <li key={doc.name} className="group">
              <Link
                href="#"
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[var(--color-surface-2)]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)]">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-[var(--color-fg-muted)]" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
                    <path d="M14 3v5h5" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-[var(--color-fg)] group-hover:text-[var(--color-accent)]">
                    {doc.name}
                  </p>
                  <p className="text-[0.8125rem] text-[var(--color-fg-muted)]">
                    {doc.size} · updated {doc.updated}
                  </p>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-[var(--color-fg-subtle)] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--color-fg)]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="card aspect-[1/1.41] overflow-hidden p-0">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-2.5 text-[0.75rem]">
              <span className="font-mono text-[var(--color-fg-subtle)]">page-1.pdf</span>
              <span className="badge">A4</span>
            </div>
            <div className="flex-1 space-y-3 p-8">
              <p className="text-2xl font-bold text-[var(--color-fg)]">Invoice #4218</p>
              <p className="text-[0.75rem] text-[var(--color-fg-subtle)]">Issued May 28, 2026</p>
              <hr className="my-4" />
              <div className="space-y-1.5 text-[0.75rem]">
                <div className="flex justify-between">
                  <span>Engineering — May</span>
                  <span className="font-mono">$ 12,400.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Design — May</span>
                  <span className="font-mono">$ 4,200.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Hosting</span>
                  <span className="font-mono">$ 312.00</span>
                </div>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between text-[0.875rem] font-semibold">
                <span>Total</span>
                <span className="font-mono">$ 16,912.00</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-semibold tracking-tight">Generated on every request.</h2>
          <p className="mt-4 text-[var(--color-fg-muted)]">
            The Pdf component is an intermediate representation, not a React element. It gets passed
            to a renderer that streams a PDF response. Use it in an API route, behind a download
            link, or inline as a response.
          </p>
          <pre className="mt-6 overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-fg)] p-5 font-mono text-[0.8125rem] leading-relaxed text-[var(--color-bg)]">
            <code>
              <span className="text-[var(--color-fg-subtle)]">{"// app/api/invoice/route.ts"}</span>
              {"\n"}
              <span className="text-[#7c3aed]">export async function</span>{" "}
              <span className="text-[#0ea5e9]">GET</span>
              <span className="text-[var(--color-fg-muted)]">() {`{`}</span>
              {"\n  "}
              <span className="text-[var(--color-fg-subtle)]">return</span>{" "}
              <span className="text-[#7c3aed]">await</span>{" "}
              <span className="text-[#0ea5e9]">renderPdf</span>
              <span className="text-[var(--color-fg-muted)]">({"<"}</span>
              <span className="text-[#dc2626]">Document</span>{" "}
              <span className="text-[#0ea5e9]">title</span>
              <span className="text-[var(--color-fg-muted)]">=</span>
              <span className="text-[#16a34a]">"Invoice"</span>
              <span className="text-[var(--color-fg-muted)]">{">"}</span>
              {"\n    "}
              <span className="text-[var(--color-fg-muted)]">{"<"}</span>
              <span className="text-[#dc2626]">Page</span>
              <span className="text-[var(--color-fg-muted)]">{">"}</span>
              {"\n      "}
              <span className="text-[var(--color-fg-muted)]">{"<"}</span>
              <span className="text-[#dc2626]">Text</span>{" "}
              <span className="text-[#0ea5e9]">fontSize</span>
              <span className="text-[var(--color-fg-muted)]">={"{20}"}</span>
              <span className="text-[var(--color-fg-muted)]">{">"}</span>
              <span className="text-[var(--color-fg)]">Total: $16,912</span>
              <span className="text-[var(--color-fg-muted)]">{"</"}</span>
              <span className="text-[#dc2626]">Text</span>
              <span className="text-[var(--color-fg-muted)]">{">"}</span>
              {"\n    "}
              <span className="text-[var(--color-fg-muted)]">{"</"}</span>
              <span className="text-[#dc2626]">Page</span>
              <span className="text-[var(--color-fg-muted)]">{">"}</span>
              {"\n  "}
              <span className="text-[var(--color-fg-muted)]">{"</"}</span>
              <span className="text-[#dc2626]">Document</span>
              <span className="text-[var(--color-fg-muted)]">{">"}</span>
              {"\n  "}
              <span className="text-[var(--color-fg-muted)]">{")"}</span>
              {"\n"}
              <span className="text-[var(--color-fg-muted)]">{`}`}</span>
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
