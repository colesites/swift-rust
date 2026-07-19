import { CodeBlock } from "@/components/ui/code-block";
import { CommandTabs } from "@/components/site/command-tabs";
import { ComponentPreview, EXAMPLE_TOC, hasPreview } from "@/components/site/component-preview";
import { DocPager } from "@/components/site/doc";
import { OnThisPage, type TocItem } from "@/components/site/on-this-page";
import { COMPONENT_DOCS } from "@/lib/component-docs";
import { ALL_COMPONENTS } from "@/lib/components";

export function generateStaticParams() {
  return ALL_COMPONENTS.map((component) => ({ slug: component.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const entry = ALL_COMPONENTS.find((c) => c.slug === params.slug);
  return {
    title: entry ? entry.name : "Component",
    description: entry ? COMPONENT_DOCS[entry.slug]?.description : undefined,
  };
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 pt-8 sm:pt-10">
      <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function ComponentPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const index = ALL_COMPONENTS.findIndex((c) => c.slug === slug);
  const entry = ALL_COMPONENTS[index];

  if (!entry) {
    return (
      <article className="max-w-3xl">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Not found</h1>
        <p className="mt-3 text-fg-muted">
          No component named “{slug}”.{" "}
          <a className="text-accent hover:underline" href="/docs/components">
            Back to components →
          </a>
        </p>
      </article>
    );
  }

  const doc = COMPONENT_DOCS[slug];
  const installable = entry.status === "featured" || entry.status === "available";
  const showPreview = hasPreview(slug);
  const description =
    doc?.description ??
    (installable
      ? `${entry.name} ships in the @swift-rust/ui registry. Add it with the CLI.`
      : entry.original
        ? `${entry.name} is a swift-rust ui original — in active development.`
        : `${entry.name} is on the roadmap — it isn't in the registry yet.`);

  const prev = ALL_COMPONENTS[index - 1];
  const next = ALL_COMPONENTS[index + 1];

  const toc: TocItem[] = [];
  if (installable) toc.push({ id: "installation", label: "Installation" });
  if (doc?.usage) toc.push({ id: "usage", label: "Usage" });
  if (doc?.composition) toc.push({ id: "composition", label: "Composition" });
  if (showPreview) {
    toc.push({ id: "examples", label: "Examples" });
    for (const ex of EXAMPLE_TOC[slug] ?? []) {
      toc.push({ id: ex.id, label: ex.label, depth: 1 });
    }
  }

  return (
    <div className="grid w-full gap-12 xl:grid-cols-[minmax(0,1fr)_12rem]">
      <article className="mx-auto w-full min-w-0 max-w-3xl">
        <div className="mb-6 flex items-center gap-2 text-sm text-fg-subtle">
          <a href="/docs/components" className="hover:text-fg">
            Components
          </a>
          <span aria-hidden>/</span>
          <span className="text-fg-muted">{entry.name}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {entry.name}
          </h1>
          {entry.original && entry.status !== "soon" && (
            <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
              New
            </span>
          )}
          {entry.status === "soon" && (
            <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-fg-subtle">
              Soon
            </span>
          )}
        </div>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg">
          {description}
        </p>

        {installable && (
          <Section id="installation" title="Installation">
            <CommandTabs command={`@swift-rust/ui add ${slug}`} />
          </Section>
        )}

        {doc?.usage && (
          <Section id="usage" title="Usage">
            <CodeBlock code={doc.usage} language="tsx" />
          </Section>
        )}

        {doc?.composition && (
          <Section id="composition" title="Composition">
            <p className="mb-4 text-fg-muted">{entry.name} is composed of these parts:</p>
            <CodeBlock code={doc.composition} showLineNumbers={false} />
          </Section>
        )}

        {showPreview && (
          <Section id="examples" title="Examples">
            <ComponentPreview slug={slug} />
          </Section>
        )}

        {!installable && !showPreview && (
          <p className="mt-8 text-fg-muted">
            {entry.original
              ? "This original is in active development — check back soon."
              : "Not in the registry yet."}
          </p>
        )}

        <DocPager
          prev={
            prev
              ? { href: `/docs/components/${prev.slug}`, label: prev.name }
              : { href: "/docs/components", label: "All components" }
          }
          next={next ? { href: `/docs/components/${next.slug}`, label: next.name } : undefined}
        />
      </article>

      <aside className="hidden xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  );
}
