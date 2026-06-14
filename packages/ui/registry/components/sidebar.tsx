"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

const SidebarContext = React.createContext<{ open: boolean; toggle: () => void } | null>(null);

export function SidebarProvider({ defaultOpen = true, children }: { defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <SidebarContext.Provider value={{ open, toggle: () => setOpen((o) => !o) }}>
      <div className="flex w-full">{children}</div>
    </SidebarContext.Provider>
  );
}

export function Sidebar({ className, children }: { className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(SidebarContext);
  return (
    <aside
      data-state={ctx?.open ? "open" : "collapsed"}
      className={cn(
        "flex shrink-0 flex-col gap-2 overflow-hidden border-r border-border bg-card p-2 text-card-foreground transition-[width] duration-200",
        ctx?.open ? "w-60" : "w-0 border-r-0 p-0",
        className,
      )}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center gap-2 px-2 py-1.5", className)} {...props} />;
}
export function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-1 flex-col gap-1 overflow-y-auto", className)} {...props} />;
}
export function SidebarGroupLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-2 pt-3 text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground", className)} {...props} />;
}
export function SidebarItem({
  active,
  className,
  ...props
}: React.HTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      data-active={active}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors [&_svg]:size-4",
        active ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}
export function SidebarTrigger({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = React.useContext(SidebarContext);
  return (
    <button
      type="button"
      aria-label="Toggle sidebar"
      onClick={() => ctx?.toggle()}
      className={cn("inline-flex size-9 items-center justify-center rounded-lg border border-border hover:bg-muted", className)}
      {...props}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /></svg>
    </button>
  );
}
