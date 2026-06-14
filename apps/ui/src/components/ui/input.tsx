import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * swift-rust ui · Input
 *
 * variant — default, outline, secondary, ghost, destructive
 * size    — xs, sm, default, md, lg   (the native `size` attribute is dropped)
 * design  — flat, soft, 3d, glass, neo, brutal, gradient
 */

export type InputVariant = "default" | "outline" | "secondary" | "ghost" | "destructive";
export type InputSize = "default" | "xs" | "sm" | "md" | "lg";
export type InputDesign = "flat" | "soft" | "3d" | "glass" | "neo" | "brutal" | "gradient";

const VARIANTS: Record<InputVariant, string> = {
  default: "border border-input bg-background",
  outline: "border-2 border-input bg-transparent",
  secondary: "border border-transparent bg-secondary",
  ghost: "border border-transparent bg-transparent hover:bg-secondary/50",
  destructive:
    "border border-destructive text-destructive placeholder:text-destructive/60 focus-visible:ring-destructive/40",
};

const SIZES: Record<InputSize, string> = {
  default: "h-9 px-3 py-1 text-sm",
  xs: "h-7 rounded-md px-2 text-xs",
  sm: "h-8 px-2.5 text-xs",
  md: "h-9 px-3 py-1 text-sm",
  lg: "h-10 px-4 text-base",
};

const DESIGNS: Record<InputDesign, string> = {
  flat: "shadow-xs",
  soft: "rounded-xl border-transparent bg-secondary shadow-none",
  // A field reads "deep" when it looks recessed: a darker top edge + a top→down
  // shading gradient sink the surface in (no inset shadow).
  "3d": "border-t-2 border-t-black/15 bg-linear-to-b from-black/[0.06] to-transparent dark:border-t-black/40",
  // Liquid glass field: blur + saturation, translucent sheen, bright rim.
  glass:
    "border-white/40 bg-white/15 backdrop-blur-xl backdrop-saturate-200 placeholder:text-foreground/50 " +
    "bg-linear-to-br from-white/30 to-white/5 " +
    "dark:border-white/20 dark:bg-white/10 dark:from-white/15 dark:to-transparent",
  neo:
    "border-transparent bg-background " +
    "shadow-[inset_3px_3px_6px_rgba(0,0,0,0.12),inset_-3px_-3px_6px_rgba(255,255,255,0.7)] " +
    "dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.05)]",
  brutal:
    "rounded-none border-2 border-foreground shadow-[3px_3px_0_0_var(--color-foreground)] " +
    "focus-visible:shadow-[1px_1px_0_0_var(--color-foreground)] focus-visible:ring-0",
  gradient:
    "border-2 border-transparent " +
    "[background:linear-gradient(var(--color-background),var(--color-background))_padding-box," +
    "linear-gradient(135deg,#8b5cf6,#d946ef,#fb923c)_border-box]",
};

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: InputVariant;
  size?: InputSize;
  design?: InputDesign;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type = "text", variant = "default", size = "default", design = "flat", ...props },
    ref,
  ) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex w-full min-w-0 rounded-lg text-foreground transition-[color,box-shadow,background-color]",
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        VARIANTS[variant],
        SIZES[size],
        DESIGNS[design],
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
