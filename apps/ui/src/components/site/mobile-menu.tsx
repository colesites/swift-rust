"use client";
import * as React from "react";
import { DocsSidebar } from "./docs-sidebar";

const MENU_LINKS = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "Docs" },
  { href: "/docs/components", label: "Components" },
];

export function MobileMenu() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-site-menu"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-9 items-center gap-2 rounded-md px-1 text-sm font-medium text-fg transition-colors hover:text-accent xl:hidden"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
        <span>Menu</span>
      </button>

      {open && (
        <div
          id="mobile-site-menu"
          className="fixed inset-x-0 bottom-0 top-14 z-40 overflow-y-auto border-t border-border bg-bg/98 backdrop-blur-xl xl:hidden"
        >
          <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 md:px-10 lg:px-12">
            <div className="max-w-72">
              <p className="px-3 text-[0.7rem] font-semibold uppercase tracking-widest text-fg-subtle">
                Menu
              </p>
              <nav className="mt-2 flex flex-col">
                {MENU_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-lg font-medium text-fg transition-colors hover:bg-surface-2"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="mt-8">
                <DocsSidebar variant="mobile" onNavigate={() => setOpen(false)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M4 7h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}
