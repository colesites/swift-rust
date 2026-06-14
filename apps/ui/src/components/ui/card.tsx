import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * swift-rust ui · Card
 *
 * variant — default, outline, secondary, ghost
 * size    — sm, default, lg (padding scale; subcomponents read it via --card-p)
 * design  — flat, soft, 3d, glass, neo, brutal, gradient
 */

export type CardVariant = "default" | "outline" | "secondary" | "ghost";
export type CardSize = "default" | "sm" | "lg";
export type CardDesign = "flat" | "soft" | "3d" | "glass" | "neo" | "brutal" | "gradient";

const VARIANTS: Record<CardVariant, string> = {
  default: "border border-border bg-card text-card-foreground",
  outline: "border-2 border-border bg-transparent text-foreground",
  secondary: "border border-transparent bg-secondary text-secondary-foreground",
  ghost: "border border-transparent bg-transparent text-foreground",
};

const SIZES: Record<CardSize, string> = {
  sm: "[--card-p:1rem]",
  default: "[--card-p:1.5rem]",
  lg: "[--card-p:2rem]",
};

const DESIGNS: Record<CardDesign, string> = {
  flat: "shadow-sm",
  soft: "rounded-2xl border-transparent bg-muted shadow-none",
  // Depth via a darker bottom lip (border, not shadow) + a top sheen, so the
  // card sits proud of the page like a physical tile.
  "3d": "border-b-[6px] border-b-black/20 bg-linear-to-b from-white/30 to-transparent dark:border-b-black/50",
  // Liquid glass: heavy blur + saturation, a translucent refractive sheen, a
  // bright rim, and a specular top highlight over a soft ambient lift.
  glass:
    "border-white/40 bg-white/15 backdrop-blur-xl backdrop-saturate-200 " +
    "bg-linear-to-br from-white/35 via-white/10 to-white/5 " +
    "shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_8px_32px_rgba(31,38,135,0.18)] " +
    "dark:border-white/20 dark:bg-white/10 dark:from-white/15 dark:via-white/5 dark:to-transparent " +
    "dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_8px_32px_rgba(0,0,0,0.45)]",
  neo:
    "border-transparent bg-background " +
    "shadow-[8px_8px_16px_rgba(0,0,0,0.15),-8px_-8px_16px_rgba(255,255,255,0.8)] " +
    "dark:shadow-[8px_8px_16px_rgba(0,0,0,0.6),-8px_-8px_16px_rgba(255,255,255,0.05)]",
  brutal: "rounded-none border-2 border-foreground shadow-[6px_6px_0_0_var(--color-foreground)]",
  gradient:
    "border-2 border-transparent " +
    "[background:linear-gradient(var(--color-card),var(--color-card))_padding-box," +
    "linear-gradient(135deg,#8b5cf6,#d946ef,#fb923c)_border-box] shadow-md",
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  size?: CardSize;
  design?: CardDesign;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", size = "default", design = "flat", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col rounded-xl",
        VARIANTS[variant],
        SIZES[size],
        DESIGNS[design],
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1.5 p-(--card-p)", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardAction = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("ml-auto self-start", className)} {...props} />
  ),
);
CardAction.displayName = "CardAction";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-(--card-p) pt-0", className)} {...props} />
  ),
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-(--card-p) pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter };
