"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface SonnerToast {
  id: number;
  title: string;
  description?: string;
  tone?: "default" | "success" | "error";
}

const listeners = new Set<(t: SonnerToast) => void>();
let counter = 0;

export function toast(title: string, opts?: { description?: string; tone?: SonnerToast["tone"] }) {
  const t: SonnerToast = { id: ++counter, title, description: opts?.description, tone: opts?.tone ?? "default" };
  for (const l of listeners) l(t);
}

const TONES: Record<NonNullable<SonnerToast["tone"]>, string> = {
  default: "border-border bg-popover text-popover-foreground",
  success: "border-emerald-600/40 bg-popover text-popover-foreground",
  error: "border-destructive/40 bg-popover text-popover-foreground",
};

export function Toaster({ duration = 3500 }: { duration?: number }) {
  const [toasts, setToasts] = React.useState<SonnerToast[]>([]);
  React.useEffect(() => {
    const add = (t: SonnerToast) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== t.id)), duration);
    };
    listeners.add(add);
    return () => {
      listeners.delete(add);
    };
  }, [duration]);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-80 flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn("pointer-events-auto rounded-lg border p-4 shadow-lg", TONES[t.tone ?? "default"])}
        >
          <p className="text-sm font-medium">{t.title}</p>
          {t.description ? <p className="mt-1 text-sm text-muted-foreground">{t.description}</p> : null}
        </div>
      ))}
    </div>
  );
}
