"use client";
import * as React from "react";
import {
  Button,
  type ButtonDesign,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button";

const VARIANTS: ButtonVariant[] = ["default", "outline", "secondary", "ghost", "destructive", "link"];
const SIZES: ButtonSize[] = ["xs", "sm", "default", "md", "lg", "icon"];
const DESIGNS: ButtonDesign[] = ["flat", "soft", "3d", "glass", "neo", "brutal", "gradient"];

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = opt === value;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors " +
                (active
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-input bg-background text-foreground hover:bg-secondary")
              }
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Playground() {
  const [variant, setVariant] = React.useState<ButtonVariant>("default");
  const [size, setSize] = React.useState<ButtonSize>("default");
  const [design, setDesign] = React.useState<ButtonDesign>("3d");

  const isIcon = size === "icon";
  const code = `<Button variant="${variant}" size="${size}" design="${design}">${
    isIcon ? "<Icon />" : "Click me"
  }</Button>`;

  return (
    <div className="grid gap-6 rounded-2xl border border-border bg-surface p-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col gap-5">
        <Segmented label="variant" value={variant} options={VARIANTS} onChange={setVariant} />
        <Segmented label="size" value={size} options={SIZES} onChange={setSize} />
        <Segmented label="design" value={design} options={DESIGNS} onChange={setDesign} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex min-h-40 flex-1 items-center justify-center rounded-xl border border-dashed border-border bg-background p-8">
          <Button variant={variant} size={size} design={design}>
            {isIcon ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M5 12h14M12 5v14" strokeLinecap="round" />
              </svg>
            ) : (
              "Click me"
            )}
          </Button>
        </div>
        <pre className="overflow-x-auto rounded-lg bg-[var(--color-code-bg,#1c1917)] px-4 py-3 text-xs leading-relaxed text-[var(--color-code-fg,#fafaf9)]">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
