"use client";
import * as React from "react";
import { CodeBlock } from "@/components/ui/code-block";

const MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const;
type Manager = (typeof MANAGERS)[number];

const RUNNER: Record<Manager, string> = {
  pnpm: "pnpm dlx",
  npm: "npx",
  yarn: "yarn dlx",
  bun: "bunx",
};

// Tabbed package-manager command, e.g. `bunx @swift-rust/ui add accordion`.
export function CommandTabs({ command }: { command: string }) {
  const [pm, setPm] = React.useState<Manager>("bun");
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[#0b0b0e]">
      <div className="flex items-center gap-1 border-b border-white/10 px-2">
        {MANAGERS.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setPm(m)}
            className={
              "border-b-2 px-3 py-2 font-mono text-xs transition-colors " +
              (pm === m
                ? "border-accent text-zinc-100"
                : "border-transparent text-zinc-500 hover:text-zinc-300")
            }
          >
            {m}
          </button>
        ))}
      </div>
      <CodeBlock code={`${RUNNER[pm]} ${command}`} showLineNumbers={false} />
    </div>
  );
}
