import type { Metadata } from "swift-rust";

export const metadata: Metadata = { title: "PDFs" };

const DOCS = [
  {
    name: "Large-Scale Apps with React and TypeScript",
    href: "/samples/Large-Scale-Apps-with-React-and-TypeScript.pdf",
    size: "4.4 MB",
  },
  {
    name: "Fluent React — build fast, performant & intuitive",
    href: "/samples/Fluent_react_build_fast_performant_and_intuitive.pdf",
    size: "4.0 MB",
  },
  {
    name: "React Interview Guide",
    href: "/samples/React%20Interview%20Guide.pdf",
    size: "3.8 MB",
  },
];

const PREVIEW_PDF = "/samples/Large-Scale-Apps-with-React-and-TypeScript.pdf";

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
              <a
                href={doc.href}
                target="_blank"
                rel="noreferrer"
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
                    {doc.size} · PDF
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
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="card overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-2.5 text-[0.75rem]">
            <span className="font-mono text-[var(--color-fg-subtle)]">
              {PREVIEW_PDF.split("/").pop()}
            </span>
            <span className="badge">live preview</span>
          </div>
          <iframe
            src={PREVIEW_PDF}
            title="PDF preview"
            className="aspect-[1/1.3] w-full bg-[var(--color-surface-2)]"
          />
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
