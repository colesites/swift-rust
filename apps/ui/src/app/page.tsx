import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DesignMorph } from "@/components/site/design-morph";
import { COMPONENT_COUNTS } from "@/lib/components";

const DIMENSIONS = [
  {
    name: "variant",
    desc: "Intent — default, outline, secondary, ghost, destructive, link.",
    chips: ["default", "outline", "ghost", "destructive"],
  },
  {
    name: "size",
    desc: "Density — xs through lg, plus five icon sizes.",
    chips: ["xs", "sm", "default", "lg", "icon"],
  },
  {
    name: "design",
    desc: "Surface — the axis shadcn doesn't have.",
    chips: ["flat", "3d", "glass", "neo", "brutal", "gradient"],
    accent: true,
  },
];

export default function Home() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 hero-glow" />
        <div className="absolute inset-0 -z-10 bg-grid opacity-50" />

        <div className="container-page flex flex-col items-center pt-24 pb-16 text-center sm:pt-32">
          <a
            href="/docs/components"
            className="rise inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3.5 py-1.5 text-sm text-fg-muted backdrop-blur transition-colors hover:border-border-strong hover:text-fg"
          >
            <span className="inline-block size-1.5 rounded-full bg-accent" />
            {COMPONENT_COUNTS.total} components · Tailwind v4
            <span aria-hidden>→</span>
          </a>

          <h1
            className="rise mt-7 max-w-4xl font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl"
            style={{ animationDelay: "60ms" }}
          >
            Components with a<br />
            <span className="text-accent">third dimension.</span>
          </h1>

          <p
            className="rise mt-6 max-w-xl text-pretty text-lg leading-relaxed text-fg-muted"
            style={{ animationDelay: "120ms" }}
          >
            Everything you know from shadcn — variants and sizes — plus a{" "}
            <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-fg">
              design
            </code>{" "}
            prop: 3D, glass, neumorphic, brutalist, gradient. Open code, you own every line.
          </p>

          <div
            className="rise mt-9 flex flex-col items-center gap-4"
            style={{ animationDelay: "180ms" }}
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild design="3d" size="lg">
                <a href="/docs">Get started</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="/docs/components">Browse components</a>
              </Button>
            </div>
            <code className="rounded-xl border border-border bg-surface/70 px-4 py-2.5 font-mono text-sm text-fg-muted">
              <span className="text-fg-subtle select-none">$ </span>
              bunx @swift-rust/ui add button
            </code>
          </div>
        </div>
      </section>

      {/* ── Live design morph ────────────────────────────────────────────── */}
      <section className="container-page pb-8">
        <DesignMorph />
      </section>

      {/* ── Three dimensions ─────────────────────────────────────────────── */}
      <section className="container-page py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Three independent axes
          </h2>
          <p className="mt-3 text-fg-muted">
            Compose them freely. The same component spans dozens of looks without a single
            override.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {DIMENSIONS.map((dim) => (
            <Card
              key={dim.name}
              design={dim.accent ? "gradient" : "flat"}
              className={dim.accent ? "" : "bg-surface"}
            >
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex items-baseline gap-2">
                  <code
                    className={
                      "font-mono text-sm " + (dim.accent ? "text-white" : "text-accent")
                    }
                  >
                    {dim.name}
                  </code>
                  {dim.accent && (
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-white">
                      ours
                    </span>
                  )}
                </div>
                <p className={"text-sm " + (dim.accent ? "text-white/85" : "text-fg-muted")}>
                  {dim.desc}
                </p>
                <div className="mt-auto flex flex-wrap gap-1.5">
                  {dim.chips.map((chip) => (
                    <span
                      key={chip}
                      className={
                        "rounded-md px-2 py-0.5 font-mono text-xs " +
                        (dim.accent
                          ? "bg-white/15 text-white"
                          : "bg-surface-2 text-fg-muted")
                      }
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Components CTA ───────────────────────────────────────────────── */}
      <section className="container-page pb-28">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-8 py-14 text-center">
          <div className="absolute inset-0 -z-10 bg-grid opacity-40" />
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {COMPONENT_COUNTS.total} components, growing
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-fg-muted">
            Install only what you need with the CLI. Every one is open code, copied into your
            project, yours to edit.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild design="glass" size="lg">
              <a href="/docs/components">View all components</a>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <a href="/docs">Read the docs</a>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-8 text-sm text-fg-subtle sm:flex-row">
          <span>
            swift<span className="text-fg-muted">·</span>rust ui — built on swift-rust, the React
            framework powered with Rust + Bun.
          </span>
          <a className="hover:text-fg" href="https://github.com/colesites/swift-rust">
            GitHub →
          </a>
        </div>
      </footer>
    </div>
  );
}
