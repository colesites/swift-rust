"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export const Slider = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      type="range"
      ref={ref}
      className={cn(
        "h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[var(--ui-surface-2)] accent-[var(--ui-accent)]",
        className,
      )}
      {...props}
    />
  ),
);
Slider.displayName = "Slider";
