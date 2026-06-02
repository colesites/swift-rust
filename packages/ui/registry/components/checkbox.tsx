"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      type="checkbox"
      ref={ref}
      className={cn(
        "h-4 w-4 shrink-0 rounded border border-[var(--ui-border-strong)] bg-[var(--ui-surface)]",
        "accent-[var(--ui-accent)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-accent)] focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Checkbox.displayName = "Checkbox";
