"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type ToastTone = "default" | "success" | "error" | "warning";

const ToastContext = React.createContext<{
  push: (msg: string, tone?: ToastTone) => void;
} | null>(null);

interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

let counter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const push = React.useCallback((message: string, tone: ToastTone = "default") => {
    const id = ++counter;
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const TONE: Record<ToastTone, string> = {
    default: "bg-[var(--ui-fg)] text-[var(--ui-bg)]",
    success: "bg-[#16a34a] text-white",
    error: "bg-[var(--ui-danger)] text-white",
    warning: "bg-[#f59e0b] text-white",
  };

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto min-w-[200px] max-w-sm rounded-md px-4 py-2.5 text-sm shadow-lg fade-in",
              TONE[t.tone],
            )}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
