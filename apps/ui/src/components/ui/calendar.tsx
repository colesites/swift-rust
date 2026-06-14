"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function Calendar({
  value: controlled,
  defaultValue,
  onChange,
  className,
}: {
  value?: Date | null;
  defaultValue?: Date;
  onChange?: (d: Date) => void;
  className?: string;
}) {
  const [selected, setSelected] = React.useState<Date | null>(defaultValue ?? null);
  const value = controlled !== undefined ? controlled : selected;
  const [view, setView] = React.useState<Date>(() => {
    const base = controlled ?? defaultValue ?? new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const pick = (day: number) => {
    const d = new Date(year, month, day);
    if (controlled === undefined) setSelected(d);
    onChange?.(d);
  };

  const shift = (n: number) => setView(new Date(year, month + n, 1));

  return (
    <div className={cn("w-fit rounded-xl border border-border bg-card p-3 text-card-foreground", className)}>
      <div className="mb-2 flex items-center justify-between px-1">
        <button type="button" onClick={() => shift(-1)} aria-label="Previous month" className="inline-flex size-7 items-center justify-center rounded-md hover:bg-muted">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <span className="text-sm font-medium">{MONTHS[month]} {year}</span>
        <button type="button" onClick={() => shift(1)} aria-label="Next month" className="inline-flex size-7 items-center justify-center rounded-md hover:bg-muted">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="flex h-8 items-center justify-center text-xs font-medium text-muted-foreground">{d}</div>
        ))}
        {cells.map((day, i) =>
          day === null ? (
            // eslint-disable-next-line react/no-array-index-key
            <div key={`e${i}`} />
          ) : (
            <button
              key={day}
              type="button"
              onClick={() => pick(day)}
              className={cn(
                "flex size-8 items-center justify-center rounded-md text-sm transition-colors hover:bg-muted",
                value && sameDay(value, new Date(year, month, day))
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : sameDay(today, new Date(year, month, day))
                    ? "ring-1 ring-inset ring-border"
                    : "",
              )}
            >
              {day}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
