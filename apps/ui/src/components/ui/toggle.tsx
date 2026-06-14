import * as React from "react";
import { cn } from "@/lib/utils";

export type ToggleVariant = "default" | "outline";
export type ToggleSize = "sm" | "default" | "lg";

const VARIANTS: Record<ToggleVariant, string> = {
  default: "bg-transparent",
  outline: "border border-input bg-transparent shadow-xs",
};

const SIZES: Record<ToggleSize, string> = {
  sm: "h-8 min-w-8 px-2 text-xs",
  default: "h-9 min-w-9 px-2.5 text-sm",
  lg: "h-10 min-w-10 px-3 text-sm",
};

export interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  variant?: ToggleVariant;
  size?: ToggleSize;
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, pressed, variant = "default", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-pressed={pressed}
      data-state={pressed ? "on" : "off"}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors",
        "hover:bg-muted hover:text-foreground",
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  ),
);
Toggle.displayName = "Toggle";

export function ToggleGroup({
  value,
  onValueChange,
  children,
  className,
}: {
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div role="group" className={cn("inline-flex gap-0.5 rounded-md border border-border p-0.5", className)}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        const c = child as React.ReactElement<{ value: string; pressed?: boolean; onClick?: () => void }>;
        return React.cloneElement(c, {
          pressed: c.props.value === value,
          onClick: () => onValueChange(c.props.value),
        });
      })}
    </div>
  );
}
