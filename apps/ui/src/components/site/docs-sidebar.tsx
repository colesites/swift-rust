"use client";
import * as React from "react";
import { COMPONENTS } from "@/lib/components";

const SECTIONS = [
  { href: "/docs", label: "Introduction" },
  { href: "/docs/components", label: "Components" },
  { href: "/docs/installation", label: "Installation" },
  { href: "/docs/theming", label: "Theming" },
  { href: "/docs/cli", label: "CLI" },
];

export function DocsSidebar() {
  const [path, setPath] = React.useState("");
  React.useEffect(() => {
    setPath(window.location.pathname);
  }, []);

  const linkClass = (href: string, active: boolean, dim = false) =>
    "flex items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors " +
    (active
      ? "bg-surface-2 font-medium text-fg"
      : dim
        ? "text-fg-subtle/60 hover:text-fg-muted"
        : "text-fg-muted hover:bg-surface-2 hover:text-fg");

  return (
    <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
      <p className="px-3 text-[0.7rem] font-semibold uppercase tracking-widest text-fg-subtle">
        Get started
      </p>
      <nav className="mt-2 flex flex-col">
        {SECTIONS.map((s) => (
          <a key={s.href} href={s.href} className={linkClass(s.href, path === s.href)}>
            {s.label}
          </a>
        ))}
      </nav>

      <p className="mt-7 px-3 text-[0.7rem] font-semibold uppercase tracking-widest text-fg-subtle">
        Components
      </p>
      <nav className="mt-2 flex flex-col">
        {COMPONENTS.map((c) => {
          const href = `/docs/components/${c.slug}`;
          return (
            <a
              key={c.slug}
              href={href}
              className={linkClass(href, path === href, c.status === "soon")}
            >
              {c.name}
              {c.original ? (
                <span className="rounded-full border border-accent/40 bg-accent/10 px-1.5 py-0.5 text-[0.6rem] font-medium uppercase tracking-wide text-accent">
                  New
                </span>
              ) : c.status === "featured" ? (
                <span className="size-1.5 rounded-full bg-accent" aria-label="featured" />
              ) : null}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
