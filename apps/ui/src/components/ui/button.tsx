import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * swift-rust ui · Button
 *
 * Three independent dimensions (Tailwind v4):
 *   variant — what the button means (default, outline, secondary, ghost, destructive, link)
 *   size    — how big it is (default, xs, sm, md, lg, icon, icon-xs, icon-sm, icon-md, icon-lg)
 *   design  — how it looks (flat, soft, 3d, glass, neo, brutal, gradient)
 *
 * `design` is the "style" dimension — the prop is named `design` because React
 * reserves `style` for inline styles.
 */

export type ButtonVariant = "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
export type ButtonSize =
  | "default"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "icon"
  | "icon-xs"
  | "icon-sm"
  | "icon-md"
  | "icon-lg";
export type ButtonDesign = "flat" | "soft" | "3d" | "glass" | "neo" | "brutal" | "gradient";

const VARIANTS: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline: "border border-input bg-background text-foreground hover:bg-secondary",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "text-foreground hover:bg-secondary",
  link: "text-primary underline-offset-4 hover:underline",
};

const SIZES: Record<ButtonSize, string> = {
  default: "h-9 px-4 text-sm",
  xs: "h-7 gap-1 rounded-md px-2.5 text-xs",
  sm: "h-8 gap-1.5 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-10 px-6 text-sm",
  icon: "size-9",
  "icon-xs": "size-7 rounded-md",
  "icon-sm": "size-8",
  "icon-md": "size-9",
  "icon-lg": "size-10",
};

const DESIGNS: Record<ButtonDesign, string> = {
  flat: "",
  soft: "rounded-xl border-transparent shadow-none",
  // Real depth, not a drop shadow: a glossy top→bottom sheen layered over the
  // variant color gives the face a curve, and a darker bottom "lip" (a thick
  // bottom border, not a shadow) makes it sit proud of the page. Pressing
  // sinks it — the lip shrinks and the whole face shifts down.
  "3d":
    "border-b-4 border-b-black/30 bg-linear-to-b from-white/25 to-black/10 " +
    "hover:brightness-110 active:translate-y-[3px] active:border-b-[1px] active:brightness-100 " +
    "dark:border-b-black/50",
  // Liquid glass: heavy blur + saturation for vibrancy, a translucent refractive
  // sheen (the diagonal white gradient), a bright rim, and a specular top
  // highlight with a soft ambient lift.
  glass:
    "border border-white/40 bg-white/15 text-foreground backdrop-blur-xl backdrop-saturate-200 " +
    "bg-linear-to-br from-white/35 via-white/10 to-white/5 hover:bg-white/25 " +
    "shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_4px_16px_rgba(31,38,135,0.18)] " +
    "dark:border-white/20 dark:bg-white/10 dark:from-white/20 dark:via-white/5 dark:to-transparent " +
    "dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_4px_16px_rgba(0,0,0,0.4)]",
  neo:
    "border-transparent bg-background text-foreground " +
    "shadow-[5px_5px_10px_rgba(0,0,0,0.15),-5px_-5px_10px_rgba(255,255,255,0.8)] " +
    "hover:shadow-[3px_3px_6px_rgba(0,0,0,0.15),-3px_-3px_6px_rgba(255,255,255,0.8)] " +
    "active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),inset_-3px_-3px_6px_rgba(255,255,255,0.7)] " +
    "dark:shadow-[5px_5px_10px_rgba(0,0,0,0.6),-5px_-5px_10px_rgba(255,255,255,0.06)] " +
    "dark:hover:shadow-[3px_3px_6px_rgba(0,0,0,0.6),-3px_-3px_6px_rgba(255,255,255,0.06)] " +
    "dark:active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.05)]",
  brutal:
    "rounded-none border-2 border-foreground font-semibold " +
    "shadow-[4px_4px_0_0_var(--color-foreground)] " +
    "active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_0_var(--color-foreground)]",
  gradient:
    "border-transparent bg-linear-to-br from-violet-500 via-fuchsia-500 to-orange-400 " +
    "text-white shadow-md hover:brightness-110 active:brightness-95",
};

// Designs that paint their own surface keep the variant's text/intent where
// possible; link buttons have no surface, so designs are skipped for them.
export interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  design?: ButtonDesign;
}

export function buttonVariants({
  variant = "default",
  size = "default",
  design = "flat",
  className,
}: ButtonStyleProps & { className?: string } = {}): string {
  return cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all",
    "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    VARIANTS[variant],
    SIZES[size],
    variant === "link" ? "" : DESIGNS[design],
    className,
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonStyleProps {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", design = "flat", asChild, ...props }, ref) => {
    const classes = buttonVariants({ variant, size, design, className });
    if (asChild && React.isValidElement(props.children)) {
      const child = props.children as React.ReactElement<{ className?: string }>;
      return React.cloneElement(child, {
        className: cn(classes, child.props.className),
      });
    }
    return <button ref={ref} className={classes} {...props} />;
  },
);
Button.displayName = "Button";
