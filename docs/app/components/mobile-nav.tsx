import { NAV } from "./sidebar";

/**
 * Mobile/tablet navigation drawer. Pure CSS (a hidden checkbox toggled by the
 * hamburger label) — these docs ship no client JS, so this must work without
 * hydration. The checkbox, backdrop, and drawer are siblings so the
 * `:checked ~` selectors in globals.css can reveal the drawer.
 */
export function MobileNav() {
  return (
    <div className="docs-mobile-nav">
      <input type="checkbox" id="docs-nav-toggle" className="docs-mobile-nav-checkbox" aria-label="Toggle navigation menu" />
      <label htmlFor="docs-nav-toggle" className="docs-mobile-nav-toggle" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        </svg>
      </label>
      <label htmlFor="docs-nav-toggle" className="docs-mobile-nav-backdrop" aria-hidden="true" />
      <nav className="docs-mobile-nav-drawer">
        {NAV.map((section) => (
          <div key={section.title} className="docs-sidebar-section">
            <h3>{section.title}</h3>
            <ul>
              {section.items.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}
