"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

const ContextMenuContext = React.createContext<{
  pos: { x: number; y: number } | null;
  open: (x: number, y: number) => void;
  close: () => void;
} | null>(null);

export function ContextMenu({ children }: { children: React.ReactNode }) {
  const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null);
  React.useEffect(() => {
    if (!pos) return;
    const close = () => setPos(null);
    document.addEventListener("click", close);
    document.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("scroll", close, true);
    };
  }, [pos]);
  return (
    <ContextMenuContext.Provider value={{ pos, open: (x, y) => setPos({ x, y }), close: () => setPos(null) }}>
      {children}
    </ContextMenuContext.Provider>
  );
}

export function ContextMenuTrigger({ className, children }: { className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(ContextMenuContext);
  return (
    <div
      className={className}
      onContextMenu={(e) => {
        e.preventDefault();
        ctx?.open(e.clientX, e.clientY);
      }}
    >
      {children}
    </div>
  );
}

export function ContextMenuContent({ className, children }: { className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(ContextMenuContext);
  if (!ctx?.pos) return null;
  return (
    <div
      role="menu"
      className={cn(
        "fixed z-50 min-w-[10rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
        className,
      )}
      style={{ left: ctx.pos.x, top: ctx.pos.y }}
    >
      {children}
    </div>
  );
}

export function ContextMenuItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="menuitem"
      className={cn(
        "flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden hover:bg-muted focus:bg-muted",
        className,
      )}
      {...props}
    />
  );
}

export function ContextMenuSeparator() {
  return <div className="my-1 h-px bg-border" />;
}

export function ContextMenuLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-2 py-1.5 text-xs font-semibold text-muted-foreground", className)} {...props} />;
}
