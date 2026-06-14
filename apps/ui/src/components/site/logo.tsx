export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <span className="inline-flex size-7 items-center justify-center rounded-[9px] bg-[#0a0a0a] ring-1 ring-white/10">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
          <g stroke="var(--sr-accent)" strokeWidth="1.7" strokeLinecap="round">
            <circle cx="12" cy="12" r="6.2" />
            <path d="M12 3.4v2M12 18.6v2M3.4 12h2M18.6 12h2M6 6l1.4 1.4M16.6 16.6l1.4 1.4M6 18l1.4-1.4M16.6 7.4l1.4-1.4" />
          </g>
          <path
            d="M13.4 6.6 L8.8 12.7 H11.6 L10.7 17 L15.2 10.9 H12.5 Z"
            fill="var(--sr-accent)"
          />
        </svg>
      </span>
      <span className="text-[0.95rem] font-semibold tracking-tight">
        swift<span className="text-fg-subtle">·</span>rust{" "}
        <span className="text-fg-muted">ui</span>
      </span>
    </span>
  );
}
