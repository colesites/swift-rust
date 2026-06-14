"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function InputOTP({
  length = 6,
  value: controlled,
  defaultValue = "",
  onChange,
  className,
}: {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
  className?: string;
}) {
  const [internal, setInternal] = React.useState(defaultValue);
  const value = controlled ?? internal;
  const refs = React.useRef<Array<HTMLInputElement | null>>([]);

  const setChar = (i: number, char: string) => {
    const next = (value.slice(0, i) + char + value.slice(i + 1)).slice(0, length);
    if (controlled === undefined) setInternal(next);
    onChange?.(next);
    if (char && i < length - 1) refs.current[i + 1]?.focus();
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {Array.from({ length }).map((_, i) => (
        <input
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => setChar(i, e.target.value.replace(/\D/g, "").slice(-1))}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value[i] && i > 0) refs.current[i - 1]?.focus();
          }}
          className="size-10 rounded-lg border border-input bg-background text-center text-lg font-medium shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/50"
        />
      ))}
    </div>
  );
}
