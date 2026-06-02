"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export const RadioGroupContext = React.createContext<{
  value: string;
  setValue: (v: string) => void;
  name: string;
} | null>(null);

export function RadioGroup({
  value: controlled,
  onValueChange,
  defaultValue,
  name = "radio",
  className,
  children,
}: {
  value?: string;
  onValueChange?: (v: string) => void;
  defaultValue?: string;
  name?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const value = controlled ?? internal;
  const setValue = (v: string) => {
    if (controlled === undefined) setInternal(v);
    onValueChange?.(v);
  };
  return (
    <RadioGroupContext.Provider value={{ value, setValue, name }}>
      <div role="radiogroup" className={cn("space-y-1", className)}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export function RadioGroupItem({
  value,
  label,
  className,
}: {
  value: string;
  label?: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(RadioGroupContext)!;
  const active = ctx.value === value;
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm transition-colors hover:bg-[var(--ui-surface-2)]",
        className,
      )}
    >
      <span
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded-full border",
          active ? "border-[var(--ui-accent)]" : "border-[var(--ui-border-strong)]",
        )}
      >
        {active ? <span className="h-2 w-2 rounded-full bg-[var(--ui-accent)]" /> : null}
      </span>
      <input
        type="radio"
        name={ctx.name}
        value={value}
        checked={active}
        onChange={() => ctx.setValue(value)}
        className="sr-only"
      />
      {label}
    </label>
  );
}
