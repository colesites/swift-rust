"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

const AlertDialogContext = React.createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);

export function AlertDialog({
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
  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
      {open ? <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" aria-hidden /> : null}
    </AlertDialogContext.Provider>
  );
}

export function AlertDialogTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) {
  const ctx = React.useContext(AlertDialogContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
      onClick: () => ctx?.setOpen(true),
    });
  }
  return <button type="button" onClick={() => ctx?.setOpen(true)}>{children}</button>;
}

export function AlertDialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(AlertDialogContext);
  if (!ctx?.open) return null;
  return (
    <div
      role="alertdialog"
      aria-modal
      className={cn(
        "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border border-border bg-background p-6 shadow-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AlertDialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-2 text-left", className)} {...props} />;
}
export function AlertDialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex justify-end gap-2 pt-2", className)} {...props} />;
}
export function AlertDialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />;
}
export function AlertDialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}
export function AlertDialogAction({ className, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = React.useContext(AlertDialogContext);
  return (
    <button
      type="button"
      onClick={(e) => {
        onClick?.(e);
        ctx?.setOpen(false);
      }}
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90",
        className,
      )}
      {...props}
    />
  );
}
export function AlertDialogCancel({ className, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = React.useContext(AlertDialogContext);
  return (
    <button
      type="button"
      onClick={(e) => {
        onClick?.(e);
        ctx?.setOpen(false);
      }}
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-lg border border-input bg-background px-4 text-sm font-medium hover:bg-secondary",
        className,
      )}
      {...props}
    />
  );
}
