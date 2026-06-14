import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * swift-rust ui · Label
 *
 * variant — default, secondary (muted), destructive (error)
 * size    — xs, sm, default, md, lg
 */

export type LabelVariant = "default" | "secondary" | "destructive";
export type LabelSize = "default" | "xs" | "sm" | "md" | "lg";

const VARIANTS: Record<LabelVariant, string> = {
  default: "text-foreground",
  secondary: "text-muted-foreground",
  destructive: "text-destructive",
};

const SIZES: Record<LabelSize, string> = {
  default: "text-sm",
  xs: "text-xs",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  variant?: LabelVariant;
  size?: LabelSize;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "flex select-none items-center gap-2 font-medium leading-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  ),
);
Label.displayName = "Label";
