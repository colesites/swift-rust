import * as React from "react";
import { cn } from "@/lib/utils";

export function Item({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-card-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function ItemMedia({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export function ItemContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex min-w-0 flex-1 flex-col gap-0.5", className)} {...props} />;
}

export function ItemTitle({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("truncate text-sm font-medium leading-none", className)} {...props} />;
}

export function ItemDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("truncate text-sm text-muted-foreground", className)} {...props} />;
}

export function ItemActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("ml-auto flex shrink-0 items-center gap-1", className)} {...props} />;
}
