import { Link } from "swift-rust";
import { Logo } from "./logo";

const ITEMS = [
  {
    section: "Workspace",
    links: [
      { href: "/dashboard", label: "Overview", icon: IconHome },
      { href: "/dashboard/analytics", label: "Analytics", icon: IconChart },
      { href: "/dashboard/posts", label: "Posts", icon: IconDoc },
    ],
  },
  {
    section: "Settings",
    links: [
      { href: "/dashboard/posts/new", label: "New post", icon: IconPlus },
      { href: "/dashboard/settings", label: "Settings", icon: IconCog },
    ],
  },
];

export function Sidebar({ pathname = "" }: { pathname?: string }) {
  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 self-start flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] lg:flex">
      <div className="flex h-14 items-center border-b border-[var(--color-border)] px-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-8 overflow-y-auto p-5">
        {ITEMS.map((group) => (
          <div key={group.section}>
            <h3 className="mb-2 px-2 text-[0.7rem] font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]">
              {group.section}
            </h3>
            <ul className="space-y-0.5">
              {group.links.map((link) => {
                const active =
                  link.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(link.href);
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[0.875rem] transition-colors ${
                        active
                          ? "bg-[var(--color-accent-soft)] font-medium text-[var(--color-accent)]"
                          : "text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)]"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-[var(--color-border)] p-4">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
          <p className="text-[0.75rem] font-medium text-[var(--color-fg)]">Pro tip</p>
          <p className="mt-1 text-[0.75rem] leading-relaxed text-[var(--color-fg-muted)]">
            Press <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-1 font-mono text-[0.6875rem]">⌘K</kbd> for quick search.
          </p>
        </div>
      </div>
    </aside>
  );
}

function IconHome({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z" strokeLinejoin="round" />
    </svg>
  );
}
function IconChart({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <path d="M3 21h18M6 17v-4m6 4V7m6 10v-7" strokeLinecap="round" />
    </svg>
  );
}
function IconDoc({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
      <path d="M14 3v5h5M8 13h8M8 17h6" strokeLinecap="round" />
    </svg>
  );
}
function IconPlus({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}
function IconCog({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  );
}
