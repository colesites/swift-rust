import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "warning";
export type BadgeSize = "default" | "sm" | "lg";

const VARIANTS: Record<BadgeVariant, string> = {
  default: "border-transparent bg-primary text-primary-foreground",
  secondary: "border-transparent bg-secondary text-secondary-foreground",
  destructive: "border-transparent bg-destructive text-destructive-foreground",
  outline: "border-border text-foreground",
  success: "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  warning: "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400",
};

const SIZES: Record<BadgeSize, string> = {
  default: "px-2.5 py-0.5 text-xs",
  sm: "px-2 py-0 text-[0.65rem]",
  lg: "px-3 py-1 text-sm",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

export function Badge({ className, variant = "default", size = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium [&_svg]:size-3",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
}
