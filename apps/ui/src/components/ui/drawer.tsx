"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

const DrawerContext = React.createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);

export function Drawer({
  open: controlled,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  children: React.ReactNode;
}) {
  const [internal, setInternal] = React.useState(false);
  const open = controlled ?? internal;
  const setOpen = (v: boolean) => {
    if (controlled === undefined) setInternal(v);
    onOpenChange?.(v);
  };
  return <DrawerContext.Provider value={{ open, setOpen }}>{children}</DrawerContext.Provider>;
}

export function DrawerTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) {
  const ctx = React.useContext(DrawerContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
      onClick: () => ctx?.setOpen(true),
    });
  }
  return <button type="button" onClick={() => ctx?.setOpen(true)}>{children}</button>;
}

export function DrawerContent({ className, children }: { className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(DrawerContext);
  if (!ctx?.open) return null;
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60" onClick={() => ctx.setOpen(false)} aria-hidden />
      <div
        role="dialog"
        aria-modal
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[85vh] w-full max-w-lg flex-col gap-4 rounded-t-2xl border border-border bg-background p-6 shadow-lg",
          className,
        )}
      >
        <div className="mx-auto h-1.5 w-12 rounded-full bg-muted" />
        {children}
      </div>
    </>
  );
}

export function DrawerClose({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) {
  const ctx = React.useContext(DrawerContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
      onClick: () => ctx?.setOpen(false),
    });
  }
  return <button type="button" onClick={() => ctx?.setOpen(false)}>{children}</button>;
}

export function DrawerHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 text-center sm:text-left", className)} {...props} />;
}
export function DrawerFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-auto flex flex-col gap-2", className)} {...props} />;
}
export function DrawerTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />;
}
export function DrawerDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}
