"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

const NavigationMenuContext = React.createContext<{ openValue: string | null; setOpenValue: (v: string | null) => void } | null>(null);

export function NavigationMenu({ children, className }: { children: React.ReactNode; className?: string }) {
  const [openValue, setOpenValue] = React.useState<string | null>(null);
  return (
    <NavigationMenuContext.Provider value={{ openValue, setOpenValue }}>
      <nav className={cn("relative", className)}>{children}</nav>
    </NavigationMenuContext.Provider>
  );
}

export function NavigationMenuList({ className, children }: { className?: string; children: React.ReactNode }) {
  return <ul className={cn("flex items-center gap-1", className)}>{children}</ul>;
}

export function NavigationMenuItem({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = React.useContext(NavigationMenuContext)!;
  return (
    <li
      onMouseEnter={() => ctx.setOpenValue(value)}
      onMouseLeave={() => ctx.setOpenValue(null)}
      className="relative"
    >
      {children}
    </li>
  );
}

export function NavigationMenuTrigger({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex h-9 items-center gap-1 rounded-md px-3 py-1 text-sm hover:bg-[var(--ui-surface-2)]"
    >
      {children}
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9l6 6 6-6" strokeLinecap="round" />
      </svg>
    </button>
  );
}

export function NavigationMenuContent({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(NavigationMenuContext)!;
  if (ctx.openValue !== value) return null;
  return (
    <div
      className={cn(
        "absolute left-0 top-full mt-1 min-w-[200px] rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] p-2 shadow-md",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function NavigationMenuLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a
      href={href}
      className={cn(
        "block rounded-sm px-2 py-1.5 text-sm text-[var(--ui-fg-muted)] hover:bg-[var(--ui-surface-2)] hover:text-[var(--ui-fg)]",
        className,
      )}
    >
      {children}
    </a>
  );
}
