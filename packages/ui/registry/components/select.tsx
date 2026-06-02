"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex h-9 w-full rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] px-3 py-1 text-sm shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-accent)] focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";
