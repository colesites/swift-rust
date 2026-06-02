"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export const SheetContext = React.createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);

export function Sheet({
  open: controlled,
  onOpenChange,
  side = "right",
  children,
}: {
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  side?: "left" | "right" | "top" | "bottom";
  children: React.ReactNode;
}) {
  const [internal, setInternal] = React.useState(false);
  const open = controlled ?? internal;
  const setOpen = (v: boolean) => {
    if (controlled === undefined) setInternal(v);
    onOpenChange?.(v);
  };
  const sideClass = {
    right: "right-0 top-0 h-full w-3/4 max-w-sm border-l",
    left: "left-0 top-0 h-full w-3/4 max-w-sm border-r",
    top: "top-0 left-0 w-full h-1/3 max-h-sm border-b",
    bottom: "bottom-0 left-0 w-full h-1/3 max-h-sm border-t",
  }[side];
  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
      {open ? (
        <>
          <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setOpen(false)} aria-hidden />
          <div
            role="dialog"
            className={cn(
              "fixed z-50 bg-[var(--ui-surface)] p-6 shadow-lg transition-transform",
              sideClass,
            )}
          >
            {typeof children === "object" && children !== null && "type" in children ? null : children}
          </div>
        </>
      ) : null}
    </SheetContext.Provider>
  );
}

export function SheetContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function SheetTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) {
  const ctx = React.useContext(SheetContext)!;
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: React.MouseEventHandler }>, {
      onClick: () => ctx.setOpen(true),
    });
  }
  return <button type="button" onClick={() => ctx.setOpen(true)}>{children}</button>;
}

export function SheetClose({ children }: { children: React.ReactNode }) {
  const ctx = React.useContext(SheetContext)!;
  return <div onClick={() => ctx.setOpen(false)}>{children}</div>;
}
