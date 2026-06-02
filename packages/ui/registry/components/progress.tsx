"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export const Progress = React.forwardRef<HTMLDivElement, { value: number; max?: number; className?: string }>(
  ({ className, value, max = 100, ...props }, ref) => (
    <div
      ref={ref}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemax={max}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-[var(--ui-surface-2)]", className)}
      {...props}
    >
      <div
        className="h-full bg-[var(--ui-accent)] transition-all"
        style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
      />
    </div>
  ),
);
Progress.displayName = "Progress";
