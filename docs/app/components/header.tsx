import { siteConfig } from "../site.config";
import { MobileNav } from "./mobile-nav";

export function Header() {
  return (
    <header className="docs-header">
      <div className="docs-header-inner">
        <div className="docs-header-left">
          <MobileNav />
          <a href="/" className="docs-logo">
          <svg
            width="24"
            height="24"
            viewBox="0 0 32 32"
            fill="none"
            role="img"
            aria-label="Swift Rust"
          >
            <title>Swift Rust</title>
            <rect width="32" height="32" rx="7" fill="var(--accent)" />
            <g stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none">
              <circle cx="16" cy="16" r="6.4" />
              <path d="M16 4.6v2.6M16 24.8v2.6M4.6 16h2.6M24.8 16h2.6M8 8l1.8 1.8M22.2 22.2l1.8 1.8M8 24l1.8-1.8M22.2 9.8l1.8-1.8" />
            </g>
            <path d="M17.8 9.5 L11.8 17 H15.3 L14.3 22.6 L20.4 15 H16.8 Z" fill="#fff" />
          </svg>
          <span>Swift Rust</span>
          <span className="badge">v{siteConfig.version}</span>
          </a>
        </div>
        <nav className="docs-nav">
          <a href="/docs">Docs</a>
          <a href="/components/image">Components</a>
          <a href="/fonts">Fonts</a>
          <a href="/videos">Videos</a>
          <a href={siteConfig.githubUrl}>GitHub</a>
        </nav>
      </div>
    </header>
  );
}
