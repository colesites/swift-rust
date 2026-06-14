"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

const CollapsibleContext = React.createContext<{ open: boolean; toggle: () => void } | null>(null);

export function Collapsible({
  defaultOpen = false,
  open: controlled,
  onOpenChange,
  className,
  children,
}: {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  className?: string;
  children: React.ReactNode;
}) {
  const [internal, setInternal] = React.useState(defaultOpen);
  const open = controlled ?? internal;
  const toggle = () => {
    const next = !open;
    if (controlled === undefined) setInternal(next);
    onOpenChange?.(next);
  };
  return (
    <CollapsibleContext.Provider value={{ open, toggle }}>
      <div className={className}>{children}</div>
    </CollapsibleContext.Provider>
  );
}

export function CollapsibleTrigger({
  className,
  children,
  asChild,
}: {
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
}) {
  const ctx = React.useContext(CollapsibleContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
      onClick: () => ctx?.toggle(),
    });
  }
  return (
    <button type="button" onClick={() => ctx?.toggle()} aria-expanded={ctx?.open} className={className}>
      {children}
    </button>
  );
}

export function CollapsibleContent({ className, children }: { className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(CollapsibleContext);
  if (!ctx?.open) return null;
  return <div className={cn("overflow-hidden", className)}>{children}</div>;
}
