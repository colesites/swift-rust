"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * swift-rust ui · Accordion
 *
 * variant — default (divided), outline (separated items), secondary, ghost
 * size    — sm, default, lg
 * design  — flat, soft, 3d, glass, neo, brutal, gradient
 *
 * variant/size/design are set once on <Accordion> and flow to items via context.
 */

export type AccordionVariant = "default" | "outline" | "secondary" | "ghost";
export type AccordionSize = "default" | "sm" | "lg";
export type AccordionDesign = "flat" | "soft" | "3d" | "glass" | "neo" | "brutal" | "gradient";

// Item chrome. The default variant is a classic divided list; the others render
// separated, surfaced items so designs (glass, brutal, …) have a card to paint.
const ITEM_VARIANTS: Record<AccordionVariant, string> = {
  default: "border-b border-border last:border-b-0",
  outline: "mb-2 rounded-lg border border-border px-4 last:mb-0",
  secondary: "mb-2 rounded-lg bg-secondary px-4 text-secondary-foreground last:mb-0",
  ghost: "rounded-lg px-2 hover:bg-secondary/50",
};

const TRIGGER_SIZES: Record<AccordionSize, string> = {
  sm: "py-3 text-xs",
  default: "py-4 text-sm",
  lg: "py-5 text-base",
};

const CONTENT_SIZES: Record<AccordionSize, string> = {
  sm: "pb-3 text-xs",
  default: "pb-4 text-sm",
  lg: "pb-5 text-base",
};

// Designs only decorate non-default variants' item surfaces (the divided list
// has no surface to paint).
const ITEM_DESIGNS: Record<AccordionDesign, string> = {
  flat: "",
  soft: "rounded-xl border-transparent bg-muted",
  // Depth via a darker bottom lip + a top sheen — no drop shadow.
  "3d": "border-transparent border-b-4 border-b-black/15 bg-linear-to-b from-white/20 to-transparent dark:border-b-black/40",
  // Liquid glass panels.
  glass:
    "border-white/40 bg-white/15 backdrop-blur-xl backdrop-saturate-200 " +
    "bg-linear-to-br from-white/30 via-white/10 to-white/5 " +
    "dark:border-white/20 dark:bg-white/10 dark:from-white/15 dark:via-white/5 dark:to-transparent",
  neo:
    "border-transparent bg-background " +
    "shadow-[5px_5px_10px_rgba(0,0,0,0.12),-5px_-5px_10px_rgba(255,255,255,0.8)] " +
    "dark:shadow-[5px_5px_10px_rgba(0,0,0,0.6),-5px_-5px_10px_rgba(255,255,255,0.05)]",
  brutal:
    "rounded-none border-2 border-foreground shadow-[4px_4px_0_0_var(--color-foreground)]",
  gradient:
    "border-2 border-transparent " +
    "[background:linear-gradient(var(--color-background),var(--color-background))_padding-box," +
    "linear-gradient(135deg,#8b5cf6,#d946ef,#fb923c)_border-box]",
};

interface AccordionContextValue {
  openItems: Set<string>;
  toggle: (value: string) => void;
  type: "single" | "multiple";
  variant: AccordionVariant;
  size: AccordionSize;
  design: AccordionDesign;
}

export const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordion(): AccordionContextValue {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion components must be used inside <Accordion>");
  return ctx;
}

export interface AccordionProps {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  variant?: AccordionVariant;
  size?: AccordionSize;
  design?: AccordionDesign;
  className?: string;
  children: React.ReactNode;
}

export function Accordion({
  type = "single",
  defaultValue,
  variant = "default",
  size = "default",
  design = "flat",
  className,
  children,
}: AccordionProps) {
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
    <AccordionContext.Provider value={{ openItems, toggle, type, variant, size, design }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  value,
  disabled,
  className,
  children,
}: {
  value: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const { openItems, variant, design } = useAccordion();
  return (
    <div
      data-value={value}
      data-disabled={disabled ? "" : undefined}
      data-state={openItems.has(value) ? "open" : "closed"}
      className={cn(
        ITEM_VARIANTS[variant],
        variant !== "default" && ITEM_DESIGNS[design],
        variant !== "default" && design !== "flat" && "mb-3 last:mb-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AccordionTrigger({
  value,
  disabled,
  className,
  children,
}: {
  value: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = useAccordion();
  const open = ctx.openItems.has(value);
  return (
    <button
      type="button"
      disabled={disabled}
      aria-expanded={open}
      data-state={open ? "open" : "closed"}
      onClick={() => ctx.toggle(value)}
      className={cn(
        "flex w-full items-center justify-between gap-4 text-left font-medium transition-all",
        "rounded-md hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:opacity-50",
        TRIGGER_SIZES[ctx.size],
        className,
      )}
    >
      {children}
      <svg
        viewBox="0 0 24 24"
        className={cn(
          "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
          open && "rotate-180",
        )}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
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
  const ctx = useAccordion();
  if (!ctx.openItems.has(value)) return null;
  return (
    <div
      data-state="open"
      className={cn("text-muted-foreground", CONTENT_SIZES[ctx.size], className)}
    >
      {children}
    </div>
  );
}
