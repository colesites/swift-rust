"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export const AccordionContext = React.createContext<{
  openItems: Set<string>;
  toggle: (value: string) => void;
  type: "single" | "multiple";
} | null>(null);

export function Accordion({
  type = "single",
  defaultValue,
  className,
  children,
}: {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  className?: string;
  children: React.ReactNode;
}) {
  const [openItems, setOpenItems] = React.useState<Set<string>>(
    () => new Set(Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : []),
  );
  const toggle = (value: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else if (type === "single") {
        next.clear();
        next.add(value);
      } else next.add(value);
      return next;
    });
  };
  return (
    <AccordionContext.Provider value={{ openItems, toggle, type }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div data-value={value} className={cn("border-b border-[var(--ui-border)]", className)}>
      {children}
    </div>
  );
}

export function AccordionTrigger({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(AccordionContext)!;
  const open = ctx.openItems.has(value);
  return (
    <button
      type="button"
      onClick={() => ctx.toggle(value)}
      className={cn(
        "flex w-full items-center justify-between py-4 text-sm font-medium transition-all",
        "hover:text-[var(--ui-accent)]",
        className,
      )}
    >
      {children}
      <svg
        viewBox="0 0 24 24"
        className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-180")}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function AccordionContent({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(AccordionContext)!;
  if (!ctx.openItems.has(value)) return null;
  return <div className={cn("pb-4 text-sm text-[var(--ui-fg-muted)]", className)}>{children}</div>;
}
