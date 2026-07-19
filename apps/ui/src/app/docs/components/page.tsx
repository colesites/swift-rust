import type { Metadata } from "swift-rust";
import { OnThisPage } from "@/components/site/on-this-page";
import { COMPONENT_COUNTS, COMPONENTS, type ComponentEntry } from "@/lib/components";

export const metadata: Metadata = {
  title: "Components",
  description: "Every component in the swift-rust ui registry, in order.",
};

function ComponentLink({ c }: { c: ComponentEntry }) {
  const dim = c.status === "soon";
  return (
    <a
      href={`/docs/components/${c.slug}`}
      className={
        "group flex items-center justify-between gap-3 rounded-lg px-3 py-3 transition-colors " +
        (dim ? "hover:bg-surface-2/60" : "hover:bg-surface-2")
      }
    >
      <span className={`text-[0.95rem] ${dim ? "text-fg-subtle/55" : "text-fg"}`}>{c.name}</span>
      {c.status === "soon" ? (
        <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-fg-subtle">
          Soon
        </span>
      ) : c.original ? (
        <span className="shrink-0 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-accent">
          New
        </span>
      ) : c.status === "featured" ? (
        <span className="size-1.5 shrink-0 rounded-full bg-accent" title="Featured">
          <span className="sr-only">Featured</span>
        </span>
      ) : (
        <span
          aria-hidden
          className="shrink-0 text-fg-subtle opacity-0 transition-opacity group-hover:opacity-100"
        >
          →
        </span>
      )}
    </a>
  );
}

export default function ComponentsIndexPage() {
  return (
    <div className="grid w-full gap-12 xl:grid-cols-[minmax(0,1fr)_12rem]">
      <article className="mx-auto w-full min-w-0 max-w-3xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-accent">
              Components
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Components
            </h1>
            <p className="mt-3 max-w-xl text-fg-muted">
              Every component in the registry, in order. The{" "}
              <span className="inline-flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-accent" /> featured
              </span>{" "}
              set carries the variant × size × design dimensions.
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-fg-muted">
            <span>
              <span className="font-display text-2xl font-semibold text-fg">
                {COMPONENT_COUNTS.available}
              </span>{" "}
              ready
            </span>
            <span className="h-8 w-px bg-border" />
            <span>
              <span className="font-display text-2xl font-semibold text-fg">
                {COMPONENT_COUNTS.total}
              </span>{" "}
              total
            </span>
          </div>
        </div>

        <div
          id="all-components"
          className="mt-10 grid scroll-mt-24 grid-cols-1 gap-x-8 gap-y-px border-t border-border pt-2 sm:grid-cols-2 md:grid-cols-3"
        >
          {COMPONENTS.map((c) => (
            <ComponentLink key={c.slug} c={c} />
          ))}
        </div>
      </article>

      <aside className="hidden xl:block">
        <OnThisPage items={[{ id: "all-components", label: "All components" }]} />
      </aside>
    </div>
  );
}
