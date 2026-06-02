import { Link } from "swift-rust";
import { Logo } from "./logo";

const COLUMNS: Array<{ title: string; links: Array<{ href: string; label: string }> }> = [
  {
    title: "Framework",
    links: [
      { href: "/", label: "Overview" },
      { href: "/blog", label: "Blog" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Examples",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/fonts", label: "Fonts" },
      { href: "/images", label: "Images" },
      { href: "/pdfs", label: "PDFs" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "https://github.com/swift-rust/swift-rust", label: "GitHub" },
      { href: "https://swift-rust.dev/docs", label: "Docs" },
      { href: "https://discord.gg/swift-rust", label: "Discord" },
      { href: "https://github.com/swift-rust/swift-rust/issues", label: "Issues" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-32 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="container-page py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-[0.875rem] leading-relaxed text-[var(--color-fg-muted)]">
              A full-stack React framework powered with Rust + Bun. TSX-first, single binary, four rendering modes.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-[0.75rem] font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[0.875rem] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[var(--color-border)] pt-8 text-[0.8125rem] text-[var(--color-fg-subtle)] sm:flex-row sm:items-center">
          <p>© {year} swift-rust. Built with Rust + Bun.</p>
          <p className="font-mono">v0.1.0 · MIT</p>
        </div>
      </div>
    </footer>
  );
}
