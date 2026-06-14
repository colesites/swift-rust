import * as React from "react";
import { cn } from "@/lib/utils";

export type SpinnerSize = "sm" | "default" | "lg";
const SIZES: Record<SpinnerSize, string> = {
  sm: "size-4 border-2",
  default: "size-5 border-2",
  lg: "size-8 border-[3px]",
};

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
}

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size = "default", ...props }, ref) => (
    <span
      ref={ref}
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block animate-spin rounded-full border-current border-t-transparent text-muted-foreground",
        SIZES[size],
        className,
      )}
      {...props}
    />
  ),
);
Spinner.displayName = "Spinner";
