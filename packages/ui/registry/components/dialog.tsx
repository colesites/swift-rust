"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

const DialogContext = React.createContext<{
  open: boolean;
  setOpen: (v: boolean) => void;
} | null>(null);

export function Dialog({
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
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
      {open ? <DialogOverlay /> : null}
    </DialogContext.Provider>
  );
}

function DialogOverlay() {
  const ctx = React.useContext(DialogContext)!;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      onClick={() => ctx.setOpen(false)}
      aria-hidden
    />
  );
}

export function DialogContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = React.useContext(DialogContext);
  React.useEffect(() => {
    if (!ctx?.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") ctx.setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [ctx]);
  if (!ctx?.open) return null;
  return (
    <div
      role="dialog"
      aria-modal
      className={cn(
        "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border border-[var(--ui-border)] bg-[var(--ui-surface)] p-6 shadow-lg rounded-xl",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 text-left", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex justify-end gap-2 pt-2", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-semibold leading-none", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-[var(--ui-fg-muted)]", className)} {...props} />;
}

export function DialogTrigger({
  asChild,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }) {
  const ctx = React.useContext(DialogContext)!;
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: React.MouseEventHandler }>, {
      onClick: (e: React.MouseEvent) => {
        (children as React.ReactElement<{ onClick?: React.MouseEventHandler }>).props.onClick?.(e);
        ctx.setOpen(true);
      },
    });
  }
  return (
    <div {...props} onClick={() => ctx.setOpen(true)}>
      {children}
    </div>
  );
}

export function DialogClose({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = React.useContext(DialogContext)!;
  return (
    <div {...props} onClick={() => ctx.setOpen(false)}>
      {children}
    </div>
  );
}
