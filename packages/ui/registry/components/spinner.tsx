"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export const Spinner = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { size?: number }>(
  ({ className, size = 16, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      aria-label="Loading"
      className={cn("inline-block animate-spin rounded-full border-2 border-current border-t-transparent", className)}
      style={{ width: size, height: size }}
      {...props}
    />
  ),
);
Spinner.displayName = "Spinner";
