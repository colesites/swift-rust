import type { Metadata } from "swift-rust";
import { Link } from "swift-rust";

export const metadata: Metadata = { title: "About" };

const PRINCIPLES = [
  {
    title: "Familiar primitives",
    body: "The patterns you already know, lifted directly from the last decade of framework design. No new vocabulary to learn.",
  },
  {
    title: "Rust all the way down",
    body: "Type-checking, bundling, SSR, and the binary itself. No more chasing Node compatibility tables.",
  },
  {
    title: "Boring infrastructure",
    body: "One binary, one port, one process. No edge runtime, no build cache, no surprises at deploy.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-[0.75rem] font-semibold uppercase tracking-wider text-fg-subtle">
        About
      </p>
      <h1 className="mt-2 text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
        Built for people who ship.
      </h1>
      <p className="mt-6 text-pretty text-lg leading-relaxed text-fg-muted">
        Swift Rust is a full-stack React framework powered with Rust + Bun. It exists because the gap between
        &quot;what JavaScript frameworks can do&quot; and &quot;what a Rust binary can be&quot; was
        annoying, and we wanted to close it.
      </p>

      <div className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">Our principles</h2>
        <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="bg-surface p-6">
              <h3 className="text-[0.95rem] font-semibold">{p.title}</h3>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-fg-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">The team</h2>
        <p className="mt-3 text-fg-muted">
          We&apos;re a small group of engineers who have spent the last decade building web frameworks.
        </p>
        <Link href="/about/team" className="link mt-4 inline-flex items-center gap-1.5 text-[0.875rem] font-medium">
          Meet the team
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
