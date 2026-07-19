"use client";
import { useSyncExternalStore } from "react";
import { NAV } from "../navigation";

const subscribeToPathname = (callback: () => void) => {
  window.addEventListener("popstate", callback);
  window.addEventListener("sr:navigate-end", callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("sr:navigate-end", callback);
  };
};

const getPathname = () => window.location.pathname.replace(/\/+$/, "") || "/";
const getServerPathname = () => "";

export function MobileNav() {
  const pathname = useSyncExternalStore(subscribeToPathname, getPathname, getServerPathname);

  return (
    <div className="docs-mobile-nav">
      <input
        type="checkbox"
        id="docs-nav-toggle"
        className="docs-mobile-nav-checkbox"
        aria-label="Toggle navigation menu"
      />
      <label htmlFor="docs-nav-toggle" className="docs-mobile-nav-toggle">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <title>Open navigation</title>
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        </svg>
        <span className="sr-only">Toggle navigation menu</span>
      </label>
      <label htmlFor="docs-nav-toggle" className="docs-mobile-nav-backdrop">
        <span className="sr-only">Close navigation menu</span>
      </label>
      <nav className="docs-mobile-nav-drawer">
        {NAV.map((section) => (
          <div key={section.title} className="docs-sidebar-section">
            <h3>{section.title}</h3>
            <ul>
              {section.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className={active ? "is-active" : undefined}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}
