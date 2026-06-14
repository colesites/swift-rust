"use client";
import * as React from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "Docs" },
  { href: "/docs/components", label: "Components" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/docs/components") return pathname.startsWith("/docs/components");
  if (href === "/docs") return pathname === "/docs" || (pathname.startsWith("/docs") && !pathname.startsWith("/docs/components"));
  return pathname === href;
}

export function NavLinks() {
  const [path, setPath] = React.useState("/");
  React.useEffect(() => {
    setPath(window.location.pathname);
  }, []);

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {LINKS.map((link) => {
        const active = isActive(path, link.href);
        return (
          <a
            key={link.href}
            href={link.href}
            className={
              "rounded-md px-3 py-1.5 text-sm transition-colors " +
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
