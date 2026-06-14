import * as React from "react";
import { cn } from "@/lib/utils";

export type CalloutTone = "default" | "info" | "success" | "warning" | "destructive";

const TONE: Record<CalloutTone, string> = {
  default: "border-border bg-card text-card-foreground",
  info: "border-sky-600/30 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  success: "border-emerald-600/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  warning: "border-amber-600/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  destructive: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function Callout({
  className,
  tone = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { tone?: CalloutTone }) {
  return <div className={cn("my-4 rounded-lg border p-4 text-sm", TONE[tone], className)} {...props} />;
}
