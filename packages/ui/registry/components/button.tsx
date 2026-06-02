"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

const VARIANTS: Record<ButtonVariant, string> = {
  default: "bg-[var(--ui-fg)] text-[var(--ui-bg)] hover:opacity-90",
  destructive: "bg-[var(--ui-danger)] text-white hover:opacity-90",
  outline: "border border-[var(--ui-border-strong)] bg-transparent hover:bg-[var(--ui-surface-2)]",
  secondary: "bg-[var(--ui-surface-2)] text-[var(--ui-fg)] hover:opacity-90",
  ghost: "hover:bg-[var(--ui-surface-2)]",
  link: "text-[var(--ui-accent)] underline-offset-4 hover:underline",
};

const SIZES: Record<ButtonSize, string> = {
  default: "h-9 px-4 text-sm",
  sm: "h-8 px-3 text-xs",
  lg: "h-10 px-6 text-sm",
  icon: "h-9 w-9",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-accent)] focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { VARIANTS as buttonVariants };
