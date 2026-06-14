import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaVariant = "default" | "outline" | "secondary" | "ghost" | "destructive";
export type TextareaDesign = "flat" | "soft" | "3d" | "glass" | "neo" | "brutal" | "gradient";

const VARIANTS: Record<TextareaVariant, string> = {
  default: "border border-input bg-background",
  outline: "border-2 border-input bg-transparent",
  secondary: "border border-transparent bg-secondary",
  ghost: "border border-transparent bg-transparent hover:bg-secondary/50",
  destructive:
    "border border-destructive text-destructive placeholder:text-destructive/60 focus-visible:ring-destructive/40",
};

const DESIGNS: Record<TextareaDesign, string> = {
  flat: "shadow-xs",
  soft: "rounded-xl border-transparent bg-secondary shadow-none",
  "3d": "border-t-2 border-t-black/15 bg-linear-to-b from-black/[0.06] to-transparent dark:border-t-black/40",
  glass:
    "border-white/40 bg-white/15 backdrop-blur-xl backdrop-saturate-200 placeholder:text-foreground/50 " +
    "bg-linear-to-br from-white/30 to-white/5 dark:border-white/20 dark:bg-white/10 dark:from-white/15 dark:to-transparent",
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

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: TextareaVariant;
  design?: TextareaDesign;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = "default", design = "flat", ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-20 w-full rounded-lg px-3 py-2 text-sm text-foreground transition-[color,box-shadow,background-color]",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        DESIGNS[design],
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
