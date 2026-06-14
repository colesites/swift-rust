import * as React from "react";
import { cn } from "@/lib/utils";

export type SwitchProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, ...props }, ref) => (
    <label className="inline-flex cursor-pointer items-center">
      <input type="checkbox" ref={ref} className="peer sr-only" {...props} />
      <span
        className={cn(
          "relative h-5 w-9 rounded-full bg-input transition-colors",
          "peer-checked:bg-primary",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-ring/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          "after:absolute after:left-0.5 after:top-0.5 after:size-4 after:rounded-full after:bg-background after:shadow-sm after:transition-transform",
          "peer-checked:after:translate-x-4",
          className,
        )}
      />
    </label>
  ),
);
Switch.displayName = "Switch";
