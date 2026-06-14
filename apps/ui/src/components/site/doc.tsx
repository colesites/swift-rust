import type { ReactNode } from "react";

export function DocHeader({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <div className="mb-10">
      <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-accent">{eyebrow}</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-fg-muted">{lead}</p>
    </div>
  );
}

export function DocH2({ children }: { children: ReactNode }) {
  return <h2 className="mt-12 font-display text-2xl font-semibold tracking-tight">{children}</h2>;
}

export function DocP({ children }: { children: ReactNode }) {
  return <p className="mt-4 leading-relaxed text-fg-muted">{children}</p>;
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <pre className="mt-4 overflow-x-auto rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm leading-relaxed text-fg">
      <code>{children}</code>
    </pre>
  );
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-fg">
      {children}
    </code>
  );
}

// Docs page-to-page navigation footer (prev / next).
export function DocPager({
  prev,
  next,
}: {
  prev?: { href: string; label: string };
  next?: { href: string; label: string };
}) {
  return (
    <div className="mt-16 flex items-center justify-between gap-4 border-t border-border pt-6 text-sm">
      {prev ? (
        <a href={prev.href} className="text-fg-muted transition-colors hover:text-fg">
          ← {prev.label}
        </a>
      ) : (
        <span />
      )}
      {next ? (
        <a href={next.href} className="text-fg-muted transition-colors hover:text-fg">
          {next.label} →
        </a>
      ) : (
        <span />
      )}
    </div>
  );
}
