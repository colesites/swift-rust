"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function Form({ className, ...props }: React.FormHTMLAttributes<HTMLFormElement>) {
  return <form className={cn("space-y-4", className)} {...props} />;
}

export function FormField({
  label,
  description,
  error,
  children,
}: {
  label?: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      {label ? <label className="text-sm font-medium text-[var(--ui-fg)]">{label}</label> : null}
      {children}
      {description && !error ? <p className="text-xs text-[var(--ui-fg-muted)]">{description}</p> : null}
      {error ? <p className="text-xs text-[var(--ui-danger)]">{error}</p> : null}
    </div>
  );
}
