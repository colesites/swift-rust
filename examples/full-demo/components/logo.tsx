export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[var(--color-fg)] text-[var(--color-bg)]">
        {/* Lightning + gear: speed (bolt) + systems-level power (gear). */}
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
          <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            <circle cx="12" cy="12" r="4.7" />
            <path d="M12 3.3v1.9M12 18.8v1.9M3.3 12h1.9M18.8 12h1.9M6 6l1.4 1.4M16.6 16.6l1.4 1.4M6 18l1.4-1.4M16.6 7.4l1.4-1.4" />
          </g>
          <path d="M13.3 6.8 L8.9 12.6 H11.5 L10.7 16.6 L15.1 10.8 H12.5 Z" fill="currentColor" stroke="none" />
        </svg>
      </span>
      <span className="text-[0.95rem] font-semibold tracking-tight text-[var(--color-fg)]">
        swift<span className="text-[var(--color-accent)]">·</span>rust
      </span>
    </span>
  );
}
