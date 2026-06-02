"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-[var(--ui-border)] bg-[var(--ui-surface)] px-3 py-2 text-sm shadow-sm",
        "placeholder:text-[var(--ui-fg-subtle)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-accent)] focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
