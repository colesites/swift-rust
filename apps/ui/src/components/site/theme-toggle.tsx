"use client";
import * as React from "react";

// The site ships dark (html.dark). Light is simply the absence of .dark
// (:root holds the light values). Both chrome and component tokens key off the
// class, so everything flips together.
export function ThemeToggle() {
  const [light, setLight] = React.useState(false);

  React.useEffect(() => {
    setLight(!document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = !light;
    root.classList.toggle("dark", !next);
    setLight(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-surface/60 text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
    >
      {light ? (
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <circle cx="12" cy="12" r="4" />
          <path
            d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
