export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {/* Single-sourced from the favicon file (lightning + gear mark). */}
      <img src="/favicon.svg" alt="" aria-hidden width={24} height={24} className="h-6 w-6" />
      <span className="text-[0.95rem] font-semibold tracking-tight text-[var(--color-fg)]">
        swift<span className="text-[var(--color-accent)]">·</span>rust
      </span>
    </span>
  );
}
