"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

const TooltipContext = React.createContext<{ label: string | null; setLabel: (v: string | null) => void } | null>(
  null,
);

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  const [label, setLabel] = React.useState<string | null>(null);
  const [pos, setPos] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  return (
    <TooltipContext.Provider value={{ label, setLabel }}>
      {children}
      {label ? (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-md bg-[var(--ui-fg)] px-2 py-1 text-xs text-[var(--ui-bg)] shadow-md"
          style={{ left: pos.x, top: pos.y - 6 }}
        >
          {label}
        </div>
      ) : null}
      <TooltipListener pos={pos} setPos={setPos} setLabel={setLabel} />
    </TooltipContext.Provider>
  );
}

function TooltipListener({
  pos,
  setPos,
  setLabel,
}: {
  pos: { x: number; y: number };
  setPos: (p: { x: number; y: number }) => void;
  setLabel: (v: string | null) => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement)?.closest<HTMLElement>("[data-tooltip]");
      if (t) {
        const r = t.getBoundingClientRect();
        setPos({ x: r.left + r.width / 2, y: r.top });
        setLabel(t.dataset.tooltip ?? null);
      }
    };
    const onOut = (e: MouseEvent) => {
      const t = (e.target as HTMLElement)?.closest<HTMLElement>("[data-tooltip]");
      if (t) setLabel(null);
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    return () => {
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [setLabel, setPos, pos]);
  void ref;
  return null;
}

export function Tooltip({
  children,
  label,
}: {
  children: React.ReactElement;
  label: string;
}) {
  return React.cloneElement(children, { "data-tooltip": label });
}
