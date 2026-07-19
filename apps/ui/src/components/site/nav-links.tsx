"use client";
import * as React from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "Docs" },
  { href: "/docs/components", label: "Components" },
];

const subscribeToPathname = (callback: () => void) => {
  window.addEventListener("popstate", callback);
  window.addEventListener("sr:navigate-end", callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("sr:navigate-end", callback);
  };
};

const getPathname = () => window.location.pathname;
const getServerPathname = () => "/";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/docs/components") return pathname.startsWith("/docs/components");
  if (href === "/docs")
    return (
      pathname === "/docs" ||
      (pathname.startsWith("/docs") && !pathname.startsWith("/docs/components"))
    );
  return pathname === href;
}

export function NavLinks() {
  const path = React.useSyncExternalStore(subscribeToPathname, getPathname, getServerPathname);

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {LINKS.map((link) => {
        const active = isActive(path, link.href);
        return (
          <a
            key={link.href}
            href={link.href}
            className={
              "inline-flex h-9 items-center rounded-md px-3 text-sm leading-none transition-colors " +
              (active ? "text-fg" : "text-fg-muted hover:text-fg")
            }
          >
            {link.label}
          </a>
        );
      })}
    </nav>
  );
}
