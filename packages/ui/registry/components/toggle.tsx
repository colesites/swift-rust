"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export const Toggle = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { pressed?: boolean }>(
  ({ className, pressed, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-pressed={pressed}
      data-state={pressed ? "on" : "off"}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-accent)]",
        pressed ? "bg-[var(--ui-surface-2)] text-[var(--ui-fg)]" : "hover:bg-[var(--ui-surface-2)]",
        className,
      )}
      {...props}
    />
  ),
);
Toggle.displayName = "Toggle";

export const ToggleGroup = ({
  value,
  onValueChange,
  children,
  className,
}: {
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <div role="group" className={cn("inline-flex rounded-md border border-[var(--ui-border)] p-0.5", className)}>
    {React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;
      const c = child as React.ReactElement<{ value: string; pressed?: boolean; onClick?: () => void }>;
      const active = c.props.value === value;
      return React.cloneElement(c, {
        pressed: active,
        onClick: () => onValueChange(c.props.value),
      });
    })}
  </div>
);
