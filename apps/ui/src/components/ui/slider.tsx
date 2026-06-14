import * as React from "react";
import { cn } from "@/lib/utils";

export type SliderProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, ...props }, ref) => (
    <input
      type="range"
      ref={ref}
      className={cn(
        "h-1.5 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary",
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Slider.displayName = "Slider";
