import { Link } from "swift-rust";
import { siteConfig } from "@/lib/site.config";
import { Logo } from "./logo";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/fonts", label: "Fonts" },
  { href: "/images", label: "Images" },
  { href: "/videos", label: "Videos" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.05.78 2.12 0 1.53-.01 2.77-.01 3.14 0 .31.21.68.8.56C20.21 21.38 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
  </svg>
);

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md">
      {/* CSS-only mobile menu toggle: no client JS required (these pages are
          static SSR). The peer checkbox drives the panel below. */}
      <input type="checkbox" id="site-menu" className="peer sr-only" aria-label="Toggle menu" />

      <div className="container-page flex h-14 items-center justify-between gap-8">
        <Link href="/" aria-label="Home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-[0.875rem] text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline btn-sm hidden sm:inline-flex"
          >
            <GitHubIcon />
            GitHub
          </a>
          <Link href={siteConfig.docsUrl} className="btn btn-accent btn-sm hidden sm:inline-flex">
            Get started
          </Link>

          {/* Hamburger / close — a label toggling the checkbox above. */}
          <label
            htmlFor="site-menu"
            aria-label="Toggle navigation menu"
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-fg)] md:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 peer-checked:hidden" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </label>
        </div>
      </div>

      {/* Mobile dropdown panel — shown only when the checkbox is checked. */}
      <nav className="hidden border-t border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 peer-checked:block md:!hidden">
        <div className="flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-[0.95rem] text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)]"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 flex gap-2 border-t border-[var(--color-border)] pt-3">
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline btn-sm flex-1 justify-center"
            >
              <GitHubIcon />
              GitHub
            </a>
            <Link href={siteConfig.docsUrl} className="btn btn-accent btn-sm flex-1 justify-center">
              Get started
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
