"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

const ToggleGroupContext = React.createContext<{
  value: string[];
  toggle: (v: string) => void;
} | null>(null);

export function ToggleGroup({
  type = "single",
  value: controlled,
  defaultValue,
  onValueChange,
  className,
  children,
}: {
  type?: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (v: string | string[]) => void;
  className?: string;
  children: React.ReactNode;
}) {
  const norm = (v: string | string[] | undefined) =>
    v === undefined ? [] : Array.isArray(v) ? v : [v];
  const [internal, setInternal] = React.useState<string[]>(norm(defaultValue));
  const value = controlled !== undefined ? norm(controlled) : internal;
  const toggle = (v: string) => {
    let next: string[];
    if (type === "single") next = value.includes(v) ? [] : [v];
    else next = value.includes(v) ? value.filter((x) => x !== v) : [...value, v];
    if (controlled === undefined) setInternal(next);
    onValueChange?.(type === "single" ? (next[0] ?? "") : next);
  };
  return (
    <ToggleGroupContext.Provider value={{ value, toggle }}>
      <div role="group" className={cn("inline-flex gap-0.5 rounded-md border border-border p-0.5", className)}>
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

export function ToggleGroupItem({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(ToggleGroupContext);
  const active = ctx?.value.includes(value);
  return (
    <button
      type="button"
      aria-pressed={active}
      data-state={active ? "on" : "off"}
      onClick={() => ctx?.toggle(value)}
      className={cn(
        "inline-flex h-8 min-w-8 items-center justify-center gap-2 rounded px-2.5 text-sm font-medium transition-colors",
        "hover:bg-muted focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/50",
        "data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground [&_svg]:size-4",
        className,
      )}
    >
      {children}
    </button>
  );
}
