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

export function Sidebar() {
  const pathname = useSyncExternalStore(subscribeToPathname, getPathname, getServerPathname);

  return (
    <aside className="docs-sidebar" data-sr-scroll-preserve="framework-docs-sidebar">
      <nav>
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
    </aside>
  );
}
