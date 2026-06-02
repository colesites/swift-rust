"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export const PopoverContext = React.createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);

export function Popover({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);
  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) {
  const ctx = React.useContext(PopoverContext)!;
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: React.MouseEventHandler }>, {
      onClick: () => ctx.setOpen(!ctx.open),
    });
  }
  return <button type="button" onClick={() => ctx.setOpen(!ctx.open)}>{children}</button>;
}

export function PopoverContent({
  className,
  children,
  align = "start",
}: {
  className?: string;
  children: React.ReactNode;
  align?: "start" | "end" | "center";
}) {
  const ctx = React.useContext(PopoverContext)!;
  if (!ctx.open) return null;
  return (
    <div
      className={cn(
        "absolute z-50 mt-1 w-72 rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] p-4 text-sm shadow-md",
        align === "end" && "right-0",
        align === "center" && "left-1/2 -translate-x-1/2",
        className,
      )}
    >
      {children}
    </div>
  );
}
