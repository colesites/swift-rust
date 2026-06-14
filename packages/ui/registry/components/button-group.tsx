import * as React from "react";
import { cn } from "@/lib/utils";

// Joins a row of <Button>s into a single segmented control: shared borders,
// rounded only on the outer ends.
export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      data-orientation={orientation}
      className={cn(
        "inline-flex isolate",
        orientation === "horizontal"
          ? "flex-row [&>*]:rounded-none [&>*:not(:first-child)]:-ml-px [&>*:first-child]:rounded-l-lg [&>*:last-child]:rounded-r-lg"
          : "flex-col [&>*]:rounded-none [&>*:not(:first-child)]:-mt-px [&>*:first-child]:rounded-t-lg [&>*:last-child]:rounded-b-lg",
        "[&>*:hover]:z-10 [&>*:focus-visible]:z-10",
        className,
      )}
      {...props}
    />
  ),
);
ButtonGroup.displayName = "ButtonGroup";
