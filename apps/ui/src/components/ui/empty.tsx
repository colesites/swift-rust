import * as React from "react";
import { cn } from "@/lib/utils";

export function Empty({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border p-10 text-center",
        className,
      )}
      {...props}
    />
  );
}

export function EmptyMedia({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-6",
        className,
      )}
      {...props}
    />
  );
}

export function EmptyTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-base font-semibold", className)} {...props} />;
}

export function EmptyDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("max-w-sm text-sm text-muted-foreground", className)} {...props} />;
}
