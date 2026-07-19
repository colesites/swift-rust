"use client";
import * as React from "react";
import { COMPONENTS } from "@/lib/components";

export const DOCS_SECTIONS = [
  { href: "/docs", label: "Introduction" },
  { href: "/docs/components", label: "Components" },
  { href: "/docs/installation", label: "Installation" },
  { href: "/docs/theming", label: "Theming" },
  { href: "/docs/cli", label: "CLI" },
];

const subscribeToPathname = (callback: () => void) => {
  window.addEventListener("popstate", callback);
  window.addEventListener("sr:navigate-end", callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("sr:navigate-end", callback);
  };
};

const getPathname = () => window.location.pathname;
const getServerPathname = () => "";

const linkClass = (active: boolean, dim = false) =>
  "flex items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors " +
  (active
    ? "bg-surface-2 font-medium text-fg"
    : dim
      ? "text-fg-subtle/60 hover:text-fg-muted"
      : "text-fg-muted hover:bg-surface-2 hover:text-fg");

export function DocsSidebar({
  variant = "desktop",
  onNavigate,
}: {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}) {
  const path = React.useSyncExternalStore(subscribeToPathname, getPathname, getServerPathname);
  const mobile = variant === "mobile";

  return (
    <div
      className={
        mobile
          ? "pb-12"
          : "docs-sidebar-scroll sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto px-4 py-8"
      }
      data-sr-scroll-preserve={mobile ? undefined : "ui-docs-sidebar"}
    >
      <p className="px-3 text-[0.7rem] font-semibold uppercase tracking-widest text-fg-subtle">
        {mobile ? "Sections" : "Get started"}
      </p>
      <nav className="mt-2 flex flex-col">
        {DOCS_SECTIONS.map((s) => (
          <a
            key={s.href}
            href={s.href}
            onClick={onNavigate}
            className={
              mobile ? `${linkClass(path === s.href)} py-2 text-base` : linkClass(path === s.href)
            }
            aria-current={path === s.href ? "page" : undefined}
          >
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
              onClick={onNavigate}
              className={
                mobile
                  ? `${linkClass(path === href, c.status === "soon")} py-2 text-base`
                  : linkClass(path === href, c.status === "soon")
              }
              aria-current={path === href ? "page" : undefined}
            >
              {c.name}
              {c.original ? (
                <span className="rounded-full border border-accent/40 bg-accent/10 px-1.5 py-0.5 text-[0.6rem] font-medium uppercase tracking-wide text-accent">
                  New
                </span>
              ) : c.status === "featured" ? (
                <span className="size-1.5 rounded-full bg-accent" title="Featured" />
              ) : null}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
