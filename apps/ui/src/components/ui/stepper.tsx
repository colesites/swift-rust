"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface StepItem {
  title: string;
  description?: string;
}

export function Stepper({
  steps,
  current = 0,
  orientation = "horizontal",
  className,
}: {
  steps: StepItem[];
  current?: number;
  orientation?: "horizontal" | "vertical";
  className?: string;
}) {
  const vertical = orientation === "vertical";
  return (
    <ol className={cn("flex w-full", vertical ? "flex-col gap-0" : "items-start", className)}>
      {steps.map((step, i) => {
        const state = i < current ? "complete" : i === current ? "current" : "upcoming";
        const last = i === steps.length - 1;
        return (
          <li key={step.title} className={cn("flex", vertical ? "gap-3" : "flex-1 flex-col items-center text-center")}>
            <div className={cn("flex items-center", vertical ? "flex-col" : "w-full")}>
              {!vertical && i > 0 && (
                <span className={cn("h-0.5 flex-1", i <= current ? "bg-primary" : "bg-border")} />
              )}
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium transition-colors",
                  state === "complete" && "border-primary bg-primary text-primary-foreground",
                  state === "current" && "border-primary text-primary",
                  state === "upcoming" && "border-border text-muted-foreground",
                )}
              >
                {state === "complete" ? (
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : (
                  i + 1
                )}
              </span>
              {!vertical && !last && (
                <span className={cn("h-0.5 flex-1", i < current ? "bg-primary" : "bg-border")} />
              )}
              {vertical && !last && <span className={cn("my-1 w-0.5 flex-1", i < current ? "bg-primary" : "bg-border")} />}
            </div>
            <div className={cn(vertical ? "pb-6 pt-1" : "mt-2")}>
              <p className={cn("text-sm font-medium", state === "upcoming" ? "text-muted-foreground" : "text-foreground")}>
                {step.title}
              </p>
              {step.description && <p className="mt-0.5 text-xs text-muted-foreground">{step.description}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
