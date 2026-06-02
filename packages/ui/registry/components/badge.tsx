"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
const VARIANTS: Record<Variant, string> = {
  default: "border-transparent bg-[var(--ui-fg)] text-[var(--ui-bg)]",
  secondary: "border-transparent bg-[var(--ui-surface-2)] text-[var(--ui-fg)]",
  destructive: "border-transparent bg-[var(--ui-danger)] text-white",
  outline: "border-[var(--ui-border-strong)] text-[var(--ui-fg)]",
  success: "border-transparent bg-[#dcfce7] text-[#166534]",
  warning: "border-transparent bg-[#fef3c7] text-[#92400e]",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}
