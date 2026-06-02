"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "default" | "success" | "warning" | "destructive" | "info";
const TONES: Record<Tone, string> = {
  default: "bg-[var(--ui-surface-2)] text-[var(--ui-fg)]",
  success: "bg-[#dcfce7] text-[#166534]",
  warning: "bg-[#fef3c7] text-[#92400e]",
  destructive: "bg-[#fee2e2] text-[#991b1b]",
  info: "bg-[#dbeafe] text-[#1e40af]",
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
}

export function Alert({ className, tone = "default", ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn("relative w-full rounded-lg border border-[var(--ui-border)] p-4 text-sm", TONES[tone], className)}
      {...props}
    />
  );
}

export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h5 className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />;
}

export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <div className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />;
}
