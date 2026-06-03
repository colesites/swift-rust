export function Header() {
    return (<header className="docs-header">
      <div className="container docs-header-inner">
        <a href="/" className="docs-logo">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" role="img" aria-label="Swift Rust">
            <title>Swift Rust</title>
            <rect width="32" height="32" rx="7" fill="var(--accent)"/>
            <path d="M8 8L16 24L24 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="16" cy="16" r="2.5" fill="white"/>
          </svg>
          <span>Swift Rust</span>
          <span className="badge">v0.1.0</span>
        </a>
        <nav className="docs-nav">
          <a href="/docs">Docs</a>
          <a href="/components/image">Components</a>
          <a href="/fonts">Fonts</a>
          <a href="/videos">Videos</a>
          <a href="https://github.com/swift-rust/swift-rust">GitHub</a>
        </nav>
      </div>
    </header>);
}
//# sourceMappingURL=header.jsx.map