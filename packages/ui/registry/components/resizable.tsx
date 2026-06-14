"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

const ResizableContext = React.createContext<{ pct: number; setPct: (n: number) => void } | null>(null);

export function ResizablePanelGroup({
  defaultSize = 50,
  className,
  children,
}: {
  defaultSize?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const [pct, setPct] = React.useState(defaultSize);
  const ref = React.useRef<HTMLDivElement>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const el = ref.current;
    if (!el) return;
    const move = (ev: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const next = ((ev.clientX - rect.left) / rect.width) * 100;
      setPct(Math.min(85, Math.max(15, next)));
    };
    const up = () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
    };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
  };

  return (
    <ResizableContext.Provider value={{ pct, setPct }}>
      <div ref={ref} className={cn("flex w-full overflow-hidden rounded-lg border border-border", className)}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && (child.type as { __srHandle?: boolean }).__srHandle) {
            return React.cloneElement(child as React.ReactElement<{ onPointerDown?: (e: React.PointerEvent) => void }>, { onPointerDown });
          }
          return child;
        })}
      </div>
    </ResizableContext.Provider>
  );
}

export function ResizablePanel({
  index = 0,
  className,
  children,
}: {
  index?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(ResizableContext);
  const pct = ctx?.pct ?? 50;
  return (
    <div className={cn("min-w-0 overflow-auto p-4", className)} style={{ flexBasis: `${index === 0 ? pct : 100 - pct}%` }}>
      {children}
    </div>
  );
}

export function ResizableHandle({ onPointerDown }: { onPointerDown?: (e: React.PointerEvent) => void }) {
  return (
    <div
      role="separator"
      onPointerDown={onPointerDown}
      className="relative w-px shrink-0 cursor-col-resize bg-border after:absolute after:inset-y-0 after:-left-1 after:w-3 hover:bg-primary"
    />
  );
}
ResizableHandle.__srHandle = true;
