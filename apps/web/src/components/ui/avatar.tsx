import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * swift-rust ui · Avatar
 *
 * size   — xs, sm, default, md, lg
 * design — flat, soft, 3d, glass, neo, brutal, gradient
 *
 * The gradient design renders a gradient ring; brutal squares the corners.
 */

export type AvatarSize = "default" | "xs" | "sm" | "md" | "lg";
export type AvatarDesign = "flat" | "soft" | "3d" | "glass" | "neo" | "brutal" | "gradient";

const SIZES: Record<AvatarSize, string> = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  default: "size-10 text-sm",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
};

const DESIGNS: Record<AvatarDesign, string> = {
  flat: "",
  soft: "ring-4 ring-secondary",
  // Depth via a darker bottom lip + a sheen over the fallback face.
  "3d": "border-b-[3px] border-b-black/30 bg-linear-to-b from-white/30 to-black/10 dark:border-b-black/50",
  // Liquid glass ring with vibrancy.
  glass: "ring-2 ring-white/50 backdrop-blur-xl backdrop-saturate-200 shadow-[0_2px_10px_rgba(31,38,135,0.2)] dark:ring-white/25",
  neo:
    "shadow-[4px_4px_8px_rgba(0,0,0,0.15),-4px_-4px_8px_rgba(255,255,255,0.8)] " +
    "dark:shadow-[4px_4px_8px_rgba(0,0,0,0.6),-4px_-4px_8px_rgba(255,255,255,0.06)]",
  brutal:
    "rounded-none border-2 border-foreground shadow-[3px_3px_0_0_var(--color-foreground)] " +
    "[&_[data-avatar-img]]:rounded-none [&_[data-avatar-fallback]]:rounded-none",
  gradient: "p-0.5 bg-linear-to-br from-violet-500 via-fuchsia-500 to-orange-400",
};

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: AvatarSize;
  design?: AvatarDesign;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = "default", design = "flat", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        SIZES[size],
        DESIGNS[design],
        className,
      )}
      {...props}
    />
  ),
);
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
  ({ className, alt = "", ...props }, ref) => (
    <img
      ref={ref}
      data-avatar-img
      alt={alt}
      className={cn("aspect-square size-full rounded-full object-cover", className)}
      {...props}
    />
  ),
);
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-avatar-fallback
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-secondary font-medium text-secondary-foreground",
        className,
      )}
      {...props}
    />
  ),
);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
