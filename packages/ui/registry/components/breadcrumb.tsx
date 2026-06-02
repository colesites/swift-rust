"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

const BreadcrumbContext = React.createContext<{ separator: React.ReactNode } | null>(null);

export function Breadcrumb({
  separator,
  children,
  className,
}: {
  separator?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const sep = separator ?? <span className="text-[var(--ui-fg-subtle)]">/</span>;
  return (
    <BreadcrumbContext.Provider value={{ separator: sep }}>
      <nav aria-label="Breadcrumb" className={className}>
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-[var(--ui-fg-muted)]">
          {children}
        </ol>
      </nav>
    </BreadcrumbContext.Provider>
  );
}

export function BreadcrumbItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const ctx = React.useContext(BreadcrumbContext)!;
  return (
    <li className={cn("inline-flex items-center gap-1.5", className)}>
      {children}
    </li>
  );
}

export function BreadcrumbLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="hover:text-[var(--ui-fg)]">
      {children}
    </a>
  );
}

export function BreadcrumbSeparator() {
  const ctx = React.useContext(BreadcrumbContext)!;
  return <li aria-hidden>{ctx.separator}</li>;
}

export function BreadcrumbPage({ children }: { children: React.ReactNode }) {
  return (
    <li aria-current="page" className="font-medium text-[var(--ui-fg)]">
      {children}
    </li>
  );
}
