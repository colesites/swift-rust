export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[var(--color-fg)] text-[var(--color-bg)]">
        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
          <path
            d="M5 4h14M5 12h9M5 20h14"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="text-[0.95rem] font-semibold tracking-tight text-[var(--color-fg)]">
        swift<span className="text-[var(--color-accent)]">·</span>rust
      </span>
    </span>
  );
}
