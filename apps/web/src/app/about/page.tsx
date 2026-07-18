import type { Metadata } from "swift-rust";
import { Link } from "swift-rust";

export const metadata: Metadata = { title: "About" };

const PRINCIPLES = [
  {
    number: "01",
    title: "Familiar primitives",
    body: "The patterns you already know, lifted directly from the last decade of framework design. No new vocabulary to learn.",
  },
  {
    number: "02",
    title: "Rust all the way down",
    body: "Type-checking, bundling, SSR, and the binary itself. No more chasing Node compatibility tables.",
  },
  {
    number: "03",
    title: "Boring infrastructure",
    body: "One binary, one port, one process. No edge runtime, no build cache, no surprises at deploy.",
  },
];

const FACTS = [
  { value: "4", label: "rendering modes" },
  { value: "1", label: "binary to deploy" },
  { value: "0", label: "Node runtime required" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <header className="grid gap-5 border-b border-border pb-10 lg:grid-cols-[0.8fr_1fr] lg:items-end">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent">
            About
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Built for people who ship.
          </h1>
        </div>
        <p className="max-w-xl text-pretty text-base leading-relaxed text-fg-muted lg:justify-self-end lg:text-lg">
          Swift Rust closes the gap between what modern React frameworks can do and what a lean Rust
          binary can be.
        </p>
      </header>

      <section className="mt-10 overflow-hidden rounded-[1.5rem] bg-fg text-bg">
        <div className="grid gap-8 p-7 sm:p-9 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:p-10">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-orange-300">
              Why it exists
            </p>
            <h2 className="mt-3 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
              Familiar React on the surface. Rust everywhere it matters.
            </h2>
            <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-stone-300">
              We wanted file-system routing, streaming SSR, and the component model teams already
              know—without carrying a JavaScript runtime into production.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-white/15">
            {FACTS.map((fact) => (
              <div key={fact.label} className="bg-fg p-4 sm:p-5">
                <p className="font-mono text-2xl font-semibold text-orange-300 sm:text-3xl">
                  {fact.value}
                </p>
                <p className="mt-1 text-[0.7rem] leading-snug text-stone-400 sm:text-xs">
                  {fact.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent">
              How we build
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Our principles
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-fg-subtle">
            A small set of constraints keeps the framework fast, understandable, and straightforward
            to operate.
          </p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {PRINCIPLES.map((principle) => (
            <div
              key={principle.title}
              className="rounded-2xl border border-border bg-surface p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-sm"
            >
              <p className="font-mono text-[0.7rem] text-accent">{principle.number}</p>
              <h3 className="mt-5 text-base font-semibold">{principle.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{principle.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 flex flex-col gap-6 rounded-2xl border border-border bg-surface-2/70 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent">
            Behind the framework
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">A small, focused team</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-fg-muted">
            Engineers across runtime, compiler, infrastructure, and design systems building the
            framework we wanted to deploy ourselves.
          </p>
        </div>
        <Link href="/about/team" className="btn btn-primary shrink-0">
          Meet the team
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </section>
    </div>
  );
}
