import * as React from "react";
import { cn } from "@/lib/utils";

// A native <select> with a chevron and the design-system token styling.
export type NativeSelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, children, ...props }, ref) => (
    <div className="relative inline-flex w-full">
      <select
        ref={ref}
        className={cn(
          "h-9 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-8 text-sm shadow-xs",
          "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <svg
        viewBox="0 0 24 24"
        className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  ),
);
NativeSelect.displayName = "NativeSelect";
