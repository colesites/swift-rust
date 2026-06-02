"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  page: number;
  total: number;
  onChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, total, onChange, className }: PaginationProps) {
  const pages: Array<number | "ellipsis"> = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== "ellipsis") pages.push("ellipsis");
  }

  return (
    <nav className={cn("flex items-center gap-1", className)}>
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-sm hover:bg-[var(--ui-surface-2)] disabled:opacity-50"
      >
        ←
      </button>
      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`e${i}`} className="px-2 text-[var(--ui-fg-subtle)]">…</span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={cn(
              "h-8 w-8 rounded-md text-sm transition-colors",
              p === page ? "bg-[var(--ui-fg)] text-[var(--ui-bg)]" : "hover:bg-[var(--ui-surface-2)]",
            )}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => onChange(Math.min(total, page + 1))}
        disabled={page === total}
        className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-sm hover:bg-[var(--ui-surface-2)] disabled:opacity-50"
      >
        →
      </button>
    </nav>
  );
}
