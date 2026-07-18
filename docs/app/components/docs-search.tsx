"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { searchFrameworkDocs } from "../search";

export function DocsSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchFrameworkDocs(query).slice(0, 10), [query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  };

  const navigateToActive = () => {
    const result = results[activeIndex];
    if (result) window.location.href = result.href;
  };

  return (
    <>
      <button
        type="button"
        className="docs-search-trigger"
        onClick={() => setOpen(true)}
        aria-label="Search documentation"
      >
        <SearchIcon />
        <span>Search documentation…</span>
        <kbd>⌘K</kbd>
      </button>

      {open && (
        <div className="docs-search-overlay">
          <button
            type="button"
            className="docs-search-backdrop"
            aria-label="Close search"
            onClick={close}
          />
          <div
            className="docs-search-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Search documentation"
          >
            <div className="docs-search-input-row">
              <SearchIcon />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setActiveIndex((index) => Math.min(index + 1, results.length - 1));
                  }
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setActiveIndex((index) => Math.max(index - 1, 0));
                  }
                  if (event.key === "Enter") {
                    event.preventDefault();
                    navigateToActive();
                  }
                }}
                placeholder="Search guides and API reference…"
              />
              <button type="button" className="docs-search-escape" onClick={close}>
                ESC
              </button>
            </div>

            <div className="docs-search-results" role="listbox">
              {results.length ? (
                results.map((result, index) => (
                  <a
                    key={result.href}
                    href={result.href}
                    role="option"
                    aria-selected={index === activeIndex}
                    className={index === activeIndex ? "is-active" : ""}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <span className="docs-search-copy">
                      <strong>{result.title}</strong>
                      <small>{result.description}</small>
                    </span>
                    <span className="docs-search-section">{result.section}</span>
                  </a>
                ))
              ) : (
                <div className="docs-search-empty">No documentation found for “{query}”.</div>
              )}
            </div>

            <div className="docs-search-footer">
              <span>↑↓ Navigate</span>
              <span>↵ Open</span>
              <span>{results.length} results</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}
