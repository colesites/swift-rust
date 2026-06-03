"use client";
import { useState } from "react";
import { NAV } from "./sidebar";

/**
 * Mobile/tablet navigation. A hamburger button toggles a slide-in drawer
 * containing the same nav tree as the desktop sidebar. Hidden on large
 * screens via CSS (.docs-mobile-nav).
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="docs-mobile-nav">
      <button
        type="button"
        className="docs-mobile-nav-toggle"
        aria-label="Toggle navigation menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? (
            <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="docs-mobile-nav-backdrop"
            aria-label="Close navigation menu"
            onClick={() => setOpen(false)}
          />
          <nav className="docs-mobile-nav-drawer">
            {NAV.map((section) => (
              <div key={section.title} className="docs-sidebar-section">
                <h3>{section.title}</h3>
                <ul>
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <a href={item.href} onClick={() => setOpen(false)}>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </>
      ) : null}
    </div>
  );
}
