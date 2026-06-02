import { Link } from "swift-rust";
import { Logo } from "./logo";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/fonts", label: "Fonts" },
  { href: "/images", label: "Images" },
  { href: "/videos", label: "Videos" },
  { href: "/pdfs", label: "PDFs" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md">
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
            href="https://github.com/swift-rust/swift-rust"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline btn-sm hidden sm:inline-flex"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.05.78 2.12 0 1.53-.01 2.77-.01 3.14 0 .31.21.68.8.56C20.21 21.38 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
            </svg>
            GitHub
          </a>
          <Link href="/contact" className="btn btn-accent btn-sm">
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
