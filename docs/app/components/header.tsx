import Image from "swift-rust/image";
import { BLUR_TRANSPARENT } from "../blur";
import { siteConfig } from "../site.config";
import { MobileNav } from "./mobile-nav";

export function Header() {
  return (
    <header className="docs-header">
      <div className="docs-header-inner">
        <div className="docs-header-left">
          <MobileNav />
          <a href="/" className="docs-logo">
          <Image
            src="/favicon.svg"
            alt="Swift Rust"
            width={24}
            height={24}
            placeholder="blur"
            blurDataURL={BLUR_TRANSPARENT}
            loader={({ src }) => src}
          />
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
