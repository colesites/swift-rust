"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

const HoverCardContext = React.createContext<{
  open: boolean;
  show: () => void;
  hide: () => void;
} | null>(null);

export function HoverCard({ children, openDelay = 200 }: { children: React.ReactNode; openDelay?: number }) {
  const [open, setOpen] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), openDelay);
  };
  const hide = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(false);
  };
  return (
    <HoverCardContext.Provider value={{ open, show, hide }}>
      <span className="relative inline-block" onMouseEnter={show} onMouseLeave={hide}>
        {children}
      </span>
    </HoverCardContext.Provider>
  );
}

export function HoverCardTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) {
  if (asChild) return <>{children}</>;
  return <span className="cursor-default">{children}</span>;
}

export function HoverCardContent({
  className,
  children,
  align = "center",
}: {
  className?: string;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
}) {
  const ctx = React.useContext(HoverCardContext);
  if (!ctx?.open) return null;
  return (
    <div
      className={cn(
        "absolute top-full z-50 mt-2 w-64 rounded-lg border border-border bg-popover p-4 text-sm text-popover-foreground shadow-md",
        align === "center" && "left-1/2 -translate-x-1/2",
        align === "end" && "right-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
