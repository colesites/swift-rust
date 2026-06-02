"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function Code({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        "rounded border border-[var(--ui-border)] bg-[var(--ui-surface-2)] px-1.5 py-0.5 font-mono text-[0.85em]",
        className,
      )}
      {...props}
    />
  );
}

export function Pre({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  return (
    <pre
      className={cn(
        "overflow-x-auto rounded-lg border border-[var(--ui-border)] bg-[var(--ui-fg)] p-4 font-mono text-[0.85em] text-[var(--ui-bg)]",
        className,
      )}
      {...props}
    />
  );
}
