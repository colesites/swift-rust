"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export const Kbd = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex h-5 select-none items-center gap-1 rounded border border-[var(--ui-border-strong)] bg-[var(--ui-surface-2)] px-1.5 font-mono text-[0.6875rem] font-medium",
        className,
      )}
      {...props}
    />
  ),
);
Kbd.displayName = "Kbd";
