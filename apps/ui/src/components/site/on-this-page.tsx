"use client";
import * as React from "react";

export interface TocItem {
  id: string;
  label: string;
  depth?: number;
}

// Right-rail table of contents that highlights the section in view.
export function OnThisPage({ items }: { items: TocItem[] }) {
  const [active, setActive] = React.useState(items[0]?.id ?? "");

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );
    for (const it of items) {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="sticky top-20">
      <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-widest text-fg-subtle">
        On this page
      </p>
      <nav className="flex flex-col gap-1 text-sm">
        {items.map((it) => (
          <a
            key={it.id}
            href={`#${it.id}`}
            className={
              (it.depth ? "pl-3 " : "") +
              "transition-colors " +
              (active === it.id ? "text-accent" : "text-fg-muted hover:text-fg")
            }
          >
            {it.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
