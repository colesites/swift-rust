"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export const Switch = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <label className="inline-flex cursor-pointer items-center">
      <input type="checkbox" ref={ref} className="peer sr-only" {...props} />
      <span
        className={cn(
          "relative h-5 w-9 rounded-full bg-[var(--ui-surface-2)] transition-colors",
          "peer-checked:bg-[var(--ui-accent)]",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--ui-accent)] peer-focus-visible:ring-offset-2",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          "after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform",
          "peer-checked:after:translate-x-4",
          className,
        )}
      />
    </label>
  ),
);
Switch.displayName = "Switch";
