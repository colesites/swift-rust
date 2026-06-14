import * as React from "react";
import { cn } from "@/lib/utils";

export const ScrollArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative overflow-auto",
        "[scrollbar-width:thin] [scrollbar-color:var(--color-border-strong)_transparent]",
        "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2",
        "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border-strong",
        "[&::-webkit-scrollbar-track]:bg-transparent",
        className,
      )}
      {...props}
    />
  ),
);
ScrollArea.displayName = "ScrollArea";
