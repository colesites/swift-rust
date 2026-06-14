"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

const DropdownContext = React.createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);

export function DropdownMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({
  asChild,
  children,
}: {
  asChild?: boolean;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(DropdownContext)!;
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: React.MouseEventHandler }>, {
      onClick: () => ctx.setOpen(!ctx.open),
    });
  }
  return <button type="button" onClick={() => ctx.setOpen(!ctx.open)}>{children}</button>;
}

export function DropdownMenuContent({
  align = "start",
  className,
  children,
}: {
  align?: "start" | "end" | "center";
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(DropdownContext)!;
  if (!ctx.open) return null;
  return (
    <div
      role="menu"
      className={cn(
        "absolute z-50 mt-1 min-w-[10rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-foreground shadow-md",
        align === "end" && "right-0",
        align === "center" && "left-1/2 -translate-x-1/2",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="menuitem"
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors",
        "hover:bg-muted focus:bg-muted",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuSeparator() {
  return <div className="my-1 h-px bg-border" />;
}

export function DropdownMenuLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-2 py-1.5 text-xs font-semibold text-muted-foreground", className)} {...props} />;
}
