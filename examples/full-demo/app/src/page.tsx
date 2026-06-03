import { posts } from "@/lib/posts";
import { Link } from "swift-rust";

const RENDERERS = [
  {
    name: "SSR + WASM",
    description: "Server-rendered HTML, hydrated with WebAssembly islands.",
    badge: "Default",
  },
  {
    name: "SSR only",
    description: "Server-rendered HTML. No client JavaScript at all.",
  },
  {
    name: "SSR + HTMX",
    description: "Progressive enhancement with HTMX-style interactions.",
  },
  {
    name: "Full WASM SPA",
    description: "Single-page app compiled entirely to WebAssembly.",
  },
];

const FEATURES = [
  {
    title: "Streaming SSR",
    description: "Async components, Suspense boundaries, and edge-ready streaming out of the box.",
    icon: IconBolt,
  },
  {
    title: "JSX / TSX first",
    description:
      "Write your UI in TypeScript with first-class types. No DSL, no config gymnastics.",
    icon: IconCode,
  },
  {
    title: "App router",
    description:
      "File-system routing, nested layouts, dynamic params, and special files you already know.",
    icon: IconLayers,
  },
  {
    title: "Built-in components",
    description: "Image, Font, and PDF components with automatic optimization, like you expect.",
    icon: IconBox,
  },
  {
    title: "Four render modes",
    description: "Pick the right rendering strategy per project, not per page.",
    icon: IconGrid,
  },
  {
    title: "Single binary",
    description:
      "Compile your app to a single Rust binary. No Node, no edge runtime, no surprises.",
    icon: IconBinary,
  },
];

export default function HomePage() {
  const recentPosts = posts.slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="container-page pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="mx-auto max-w-3xl text-center">
            <Link
              href="/blog/swift-rust-0-1"
              className="badge badge-accent mb-8 inline-flex hover:opacity-90"
            >
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-current" />
              v0.1.0 — first public preview
              <svg
                viewBox="0 0 24 24"
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <h1 className="text-balance text-5xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-6xl md:text-7xl">
              The React framework
              <br />
              <span className="text-[var(--color-accent)]">Powered</span>{" "}
              <span className="text-[var(--color-fg-muted)]">with Rust +</span>{" "}
              <span className="text-[var(--color-accent)]">Bun</span>.
            </h1>
            <p className="mx-auto mt-7 max-w-xl text-pretty text-lg leading-relaxed text-[var(--color-fg-muted)]">
              TSX, streaming SSR, file-system routing, and a single binary at deploy.{" "}
              <span className="font-semibold text-[var(--color-fg)]">10x faster than Next.js.</span>{" "}
              Familiar to anyone who has used Next.js. Familiar to nobody else.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link href="/contact" className="btn btn-accent btn-lg">
                Get started
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="https://github.com/swift-rust/swift-rust"
                className="btn btn-outline btn-lg"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.05.78 2.12 0 1.53-.01 2.77-.01 3.14 0 .31.21.68.8.56C20.21 21.38 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
                </svg>
                Star on GitHub
              </Link>
            </div>
          </div>

          <CodePreview />
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-24">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Four ways to render.
            </h2>
            <p className="mt-4 text-pretty text-[var(--color-fg-muted)]">
              Pick a mode when you scaffold. Change it later in one line of config.
            </p>
          </div>
          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
            {RENDERERS.map((r) => (
              <div key={r.name} className="flex flex-col gap-2 bg-[var(--color-surface)] p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[0.95rem] font-semibold text-[var(--color-fg)]">{r.name}</h3>
                  {r.badge ? <span className="badge badge-accent">{r.badge}</span> : null}
                </div>
                <p className="text-[0.875rem] leading-relaxed text-[var(--color-fg-muted)]">
                  {r.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything you&apos;d expect.
            </h2>
            <p className="mt-4 text-pretty text-[var(--color-fg-muted)]">
              The primitives every framework should have shipped with years ago.
            </p>
          </div>
          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="flex flex-col gap-3 bg-[var(--color-surface)] p-6 transition-colors hover:bg-[var(--color-surface-2)]"
                >
                  <Icon className="h-5 w-5 text-[var(--color-accent)]" />
                  <h3 className="text-[0.95rem] font-semibold text-[var(--color-fg)]">{f.title}</h3>
                  <p className="text-[0.875rem] leading-relaxed text-[var(--color-fg-muted)]">
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-24">
        <div className="container-page">
          <div className="grid items-start gap-16 lg:grid-cols-[1fr_1.4fr]">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">From the blog.</h2>
              <p className="mt-4 text-[var(--color-fg-muted)]">
                Field notes, release announcements, and the occasional rant about bundlers.
              </p>
              <Link
                href="/blog"
                className="mt-6 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
              >
                Read all posts
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
            <ul className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
              {recentPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex items-start justify-between gap-6 py-6 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-[0.75rem] text-[var(--color-fg-subtle)]">
                        <time dateTime={post.date}>{post.date}</time>
                        <span>·</span>
                        <span>{post.readingTime}</span>
                      </div>
                      <h3 className="mt-2 text-[1.0625rem] font-semibold text-[var(--color-fg)] group-hover:text-[var(--color-accent)]">
                        {post.title}
                      </h3>
                      <p className="mt-1.5 text-[0.875rem] leading-relaxed text-[var(--color-fg-muted)]">
                        {post.excerpt}
                      </p>
                    </div>
                    <svg
                      viewBox="0 0 24 24"
                      className="mt-1 h-4 w-4 shrink-0 text-[var(--color-fg-subtle)] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--color-fg)]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-page">
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-fg)] p-12 text-center sm:p-16">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-[var(--color-bg)] sm:text-4xl">
              Stop waiting on the build.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-[var(--color-fg-subtle)]">
              Install with one command. Scaffold a project, write TSX, ship a binary.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <code className="rounded-md border border-white/10 bg-white/5 px-3 py-2 font-mono text-[0.875rem] text-white">
                bun create swift-rust@latest
              </code>
              <Link href="/contact" className="btn btn-accent">
                Talk to us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function CodePreview() {
  return (
    <div className="mx-auto mt-20 max-w-4xl overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_24px_64px_-12px_rgb(0_0_0_0.12)]">
      <div className="flex items-center gap-1.5 border-b border-[var(--color-border)] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-[0.75rem] text-[var(--color-fg-subtle)]">
          app/page.tsx
        </span>
      </div>
      <pre className="overflow-x-auto p-6 font-mono text-[0.8125rem] leading-relaxed">
        <code>
          <span className="block text-[var(--color-fg-subtle)]">
            {"// A page is just a component."}
          </span>
          {"\n"}
          <span className="text-[#7c3aed]">export default function</span>{" "}
          <span className="text-[#0ea5e9]">Page</span>
          <span className="text-[var(--color-fg-muted)]">() {"{"}</span>
          {"\n  "}
          <span className="text-[var(--color-fg-subtle)]">return</span>{" "}
          <span className="text-[var(--color-fg-muted)]">(</span>
          {"\n    <"}
          <span className="text-[#dc2626]">main</span>{" "}
          <span className="text-[#0ea5e9]">className</span>
          <span className="text-[var(--color-fg-muted)]">=</span>
          <span className="text-[#16a34a]">"container"</span>
          <span className="text-[var(--color-fg-muted)]">{">"}</span>
          {"\n      <"}
          <span className="text-[#dc2626]">h1</span>
          <span className="text-[var(--color-fg-muted)]">{">"}</span>
          <span className="text-[var(--color-fg)]">Hello from Rust</span>
          <span className="text-[var(--color-fg-muted)]">{"</"}</span>
          <span className="text-[#dc2626]">h1</span>
          <span className="text-[var(--color-fg-muted)]">{">"}</span>
          {"\n      <"}
          <span className="text-[#dc2626]">p</span>
          <span className="text-[var(--color-fg-muted)]">{">"}</span>
          <span className="text-[var(--color-fg-muted)]">{"Streamed in 14ms."}</span>
          <span className="text-[var(--color-fg-muted)]">{"</"}</span>
          <span className="text-[#dc2626]">p</span>
          <span className="text-[var(--color-fg-muted)]">{">"}</span>
          {"\n    "}
          <span className="text-[var(--color-fg-muted)]">{"</"}</span>
          <span className="text-[#dc2626]">main</span>
          <span className="text-[var(--color-fg-muted)]">{">"}</span>
          {"\n  "}
          <span className="text-[var(--color-fg-muted)]">{")"}</span>
          {"\n"}
          <span className="text-[var(--color-fg-muted)]">{"}"}</span>
        </code>
      </pre>
    </div>
  );
}

function IconBolt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
    >
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" strokeLinejoin="round" />
    </svg>
  );
}
function IconCode({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
    >
      <path d="m8 6-6 6 6 6M16 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconLayers({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
    >
      <path d="M12 3 2 8l10 5 10-5-10-5ZM2 14l10 5 10-5M2 18l10 5 10-5" strokeLinejoin="round" />
    </svg>
  );
}
function IconBox({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
    >
      <path d="M3 7v10l9 4 9-4V7l-9-4-9 4Z" strokeLinejoin="round" />
      <path d="M3 7l9 4 9-4M12 11v10" />
    </svg>
  );
}
function IconGrid({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function IconBinary({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
    >
      <path
        d="M6 4 2 9l4 5M18 4l4 5-4 5M12 4v16M9 4h6M9 20h6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
