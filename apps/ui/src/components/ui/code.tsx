import * as React from "react";
import { cn } from "@/lib/utils";

export function Code({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        "rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground",
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
        "overflow-x-auto rounded-lg border border-border bg-foreground p-4 font-mono text-[0.85em] text-background",
        className,
      )}
      {...props}
    />
  );
}
