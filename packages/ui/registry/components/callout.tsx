"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "default" | "success" | "warning" | "destructive";
const TONE: Record<Tone, string> = {
  default: "border-[var(--ui-border)] bg-[var(--ui-surface)]",
  success: "border-[#86efac] bg-[#f0fdf4]",
  warning: "border-[#fde68a] bg-[#fffbeb]",
  destructive: "border-[#fecaca] bg-[#fef2f2]",
};

export function Callout({ className, tone = "default", ...props }: React.HTMLAttributes<HTMLDivElement> & { tone?: Tone }) {
  return (
    <div
      className={cn("my-4 rounded-lg border p-4 text-sm", TONE[tone], className)}
      {...props}
    />
  );
}
