import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * swift-rust ui · Alert
 *
 * variant — default, destructive, success, warning, info, outline, secondary
 * size    — sm, default, lg
 * design  — flat, soft, 3d, glass, neo, brutal, gradient
 *
 * (`tone` is accepted as a deprecated alias of `variant`.)
 */

export type AlertVariant =
  | "default"
  | "destructive"
  | "success"
  | "warning"
  | "info"
  | "outline"
  | "secondary";
export type AlertSize = "default" | "sm" | "lg";
export type AlertDesign = "flat" | "soft" | "3d" | "glass" | "neo" | "brutal" | "gradient";

const VARIANTS: Record<AlertVariant, string> = {
  default: "border-border bg-card text-card-foreground",
  destructive:
    "border-destructive/30 bg-destructive/10 text-destructive [&_[data-alert-description]]:text-destructive/90",
  success:
    "border-emerald-600/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 " +
    "[&_[data-alert-description]]:text-emerald-700/90 dark:[&_[data-alert-description]]:text-emerald-400/90",
  warning:
    "border-amber-600/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 " +
    "[&_[data-alert-description]]:text-amber-700/90 dark:[&_[data-alert-description]]:text-amber-400/90",
  info:
    "border-sky-600/30 bg-sky-500/10 text-sky-700 dark:text-sky-400 " +
    "[&_[data-alert-description]]:text-sky-700/90 dark:[&_[data-alert-description]]:text-sky-400/90",
  outline: "border-2 border-border bg-transparent text-foreground",
  secondary: "border-transparent bg-secondary text-secondary-foreground",
};

const SIZES: Record<AlertSize, string> = {
  sm: "p-3 text-xs [&_[data-alert-title]]:text-sm",
  default: "p-4 text-sm",
  lg: "p-6 text-base",
};

const DESIGNS: Record<AlertDesign, string> = {
  flat: "",
  soft: "rounded-2xl border-transparent",
  // Depth via a darker bottom lip + a top sheen — no drop shadow.
  "3d": "border-b-4 border-b-black/15 bg-linear-to-b from-white/20 to-transparent dark:border-b-black/40",
  // Liquid glass panel.
  glass:
    "border-white/40 bg-white/15 backdrop-blur-xl backdrop-saturate-200 " +
    "bg-linear-to-br from-white/30 via-white/10 to-white/5 " +
    "shadow-[inset_0_1px_1px_rgba(255,255,255,0.55),0_6px_24px_rgba(31,38,135,0.16)] " +
    "dark:border-white/20 dark:bg-white/10 dark:from-white/15 dark:via-white/5 dark:to-transparent " +
    "dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_6px_24px_rgba(0,0,0,0.4)]",
  neo:
    "border-transparent bg-background " +
    "shadow-[6px_6px_12px_rgba(0,0,0,0.12),-6px_-6px_12px_rgba(255,255,255,0.8)] " +
    "dark:shadow-[6px_6px_12px_rgba(0,0,0,0.6),-6px_-6px_12px_rgba(255,255,255,0.05)]",
  brutal: "rounded-none border-2 border-foreground shadow-[4px_4px_0_0_var(--color-foreground)]",
  gradient:
    "border-2 border-transparent " +
    "[background:linear-gradient(var(--color-card),var(--color-card))_padding-box," +
    "linear-gradient(135deg,#8b5cf6,#d946ef,#fb923c)_border-box]",
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  /** @deprecated use `variant` */
  tone?: AlertVariant;
  size?: AlertSize;
  design?: AlertDesign;
}

export function Alert({
  className,
  variant,
  tone,
  size = "default",
  design = "flat",
  ...props
}: AlertProps) {
  const v = variant ?? tone ?? "default";
  return (
    <div
      role="alert"
      className={cn(
        "relative grid w-full grid-cols-[0_1fr] gap-y-0.5 rounded-lg border",
        "has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5",
        // Reserve room on the trailing edge when an AlertAction is present.
        "has-[[data-alert-action]]:pr-16",
        VARIANTS[v],
        SIZES[size],
        DESIGNS[design],
        className,
      )}
      {...props}
    />
  );
}

export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      data-alert-title
      className={cn("col-start-2 mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  );
}

export function AlertDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      data-alert-description
      className={cn("col-start-2 text-muted-foreground [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
}

/** A trailing action (button, link, …) pinned to the top-right of the alert. */
export function AlertAction({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-alert-action className={cn("absolute right-3 top-3", className)} {...props} />
  );
}
