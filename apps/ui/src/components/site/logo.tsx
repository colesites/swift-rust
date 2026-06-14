export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      {/* Single-sourced from the favicon so the mark and tab icon never drift. */}
      <img src="/favicon.svg" alt="" aria-hidden width={24} height={24} className="size-6" />
      <span className="text-[0.95rem] font-semibold tracking-tight">
        swift<span className="text-fg-subtle">·</span>rust{" "}
        <span className="text-fg-muted">ui</span>
      </span>
    </span>
  );
}
