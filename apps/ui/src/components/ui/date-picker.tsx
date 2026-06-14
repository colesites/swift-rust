"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

export function DatePicker({
  value: controlled,
  defaultValue,
  onChange,
  placeholder = "Pick a date",
  className,
}: {
  value?: Date | null;
  defaultValue?: Date;
  onChange?: (d: Date) => void;
  placeholder?: string;
  className?: string;
}) {
  const [internal, setInternal] = React.useState<Date | null>(defaultValue ?? null);
  const value = controlled !== undefined ? controlled : internal;
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

  const pick = (d: Date) => {
    if (controlled === undefined) setInternal(d);
    onChange?.(d);
    setOpen(false);
  };

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-9 w-56 items-center gap-2 rounded-lg border border-input bg-background px-3 text-left text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <svg viewBox="0 0 24 24" className="size-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
        <span className={cn(!value && "text-muted-foreground")}>
          {value ? value.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : placeholder}
        </span>
      </button>
      {open && (
        <div className="absolute z-50 mt-2">
          <Calendar value={value} onChange={pick} />
        </div>
      )}
    </div>
  );
}
