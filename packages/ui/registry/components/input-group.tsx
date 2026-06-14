import * as React from "react";
import { cn } from "@/lib/utils";

// A row that fuses addons (icons, text, buttons) with an input into one control.
export function InputGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex h-9 w-full items-center rounded-lg border border-input bg-background text-sm shadow-xs transition-[color,box-shadow]",
        "focus-within:ring-2 focus-within:ring-ring/50",
        "[&>input]:h-full [&>input]:min-w-0 [&>input]:flex-1 [&>input]:border-0 [&>input]:bg-transparent [&>input]:px-3 [&>input]:outline-hidden",
        className,
      )}
      {...props}
    />
  );
}

export function InputGroupAddon({
  className,
  align = "start",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { align?: "start" | "end" }) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2.5 text-muted-foreground [&_svg]:size-4",
        align === "end" ? "order-last" : "",
        className,
      )}
      {...props}
    />
  );
}
