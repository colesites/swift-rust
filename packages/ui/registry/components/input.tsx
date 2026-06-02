"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-9 w-full rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] px-3 py-1 text-sm shadow-sm",
        "placeholder:text-[var(--ui-fg-subtle)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-accent)] focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
