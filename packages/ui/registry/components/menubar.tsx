"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

const MenubarContext = React.createContext<{ openId: string | null; setOpenId: (id: string | null) => void } | null>(null);

export function Menubar({ className, children }: { className?: string; children: React.ReactNode }) {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpenId(null);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  return (
    <MenubarContext.Provider value={{ openId, setOpenId }}>
      <div ref={ref} className={cn("flex items-center gap-0.5 rounded-lg border border-border bg-background p-1", className)}>
        {children}
      </div>
    </MenubarContext.Provider>
  );
}

export function MenubarMenu({ value, label, children }: { value: string; label: string; children: React.ReactNode }) {
  const ctx = React.useContext(MenubarContext);
  const open = ctx?.openId === value;
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => ctx?.setOpenId(open ? null : value)}
        onMouseEnter={() => ctx?.openId && ctx.setOpenId(value)}
        className={cn("rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted", open && "bg-muted")}
      >
        {label}
      </button>
      {open && (
        <div role="menu" className="absolute left-0 z-50 mt-1 min-w-[12rem] rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md">
          {children}
        </div>
      )}
    </div>
  );
}

export function MenubarItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div role="menuitem" className={cn("flex cursor-pointer select-none items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted", className)} {...props} />
  );
}

export function MenubarSeparator() {
  return <div className="my-1 h-px bg-border" />;
}

export function MenubarShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />;
}
