"use client";
import * as React from "react";
import { searchUiDocs } from "@/lib/search";

function navigateToActiveResult() {
  const activeResult = document.querySelector<HTMLAnchorElement>(
    '[role="option"][aria-selected="true"]',
  );
  activeResult?.click();
}

export function DocsSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const results = React.useMemo(() => searchUiDocs(query).slice(0, 10), [query]);

  React.useEffect(() => {
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

  React.useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const close = () => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden h-9 items-center gap-2 rounded-md border border-border bg-surface pl-3 pr-2 text-sm text-fg-subtle transition-colors hover:border-border-strong hover:text-fg sm:flex"
        aria-label="Search documentation"
      >
        <SearchIcon />
        <span className="hidden w-40 text-left lg:inline">Search documentation…</span>
        <kbd className="hidden rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[0.7rem] text-fg-subtle lg:inline">
          ⌘K
        </kbd>
      </button>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-surface text-fg-muted sm:hidden"
        aria-label="Search documentation"
      >
        <SearchIcon />
      </button>

      {open && (
        <dialog
          ref={dialogRef}
          aria-label="Search documentation"
          className="fixed inset-0 z-[100] m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-black/50"
          onCancel={(event) => {
            event.preventDefault();
            close();
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") close();
          }}
        >
          <div className="flex h-full items-start justify-center px-4 pt-[10vh] sm:pt-[14vh]">
            <div className="w-full max-w-[34rem] overflow-hidden rounded-lg border border-border-strong bg-bg shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
              <div className="flex items-center gap-3 border-b border-border px-3">
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
                      navigateToActiveResult();
                    }
                  }}
                  placeholder="Search components and guides…"
                  className="h-12 min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-fg-subtle"
                />
                <button
                  type="button"
                  onClick={close}
                  className="rounded border border-border px-1.5 py-0.5 font-mono text-[0.65rem] text-fg-subtle"
                >
                  ESC
                </button>
              </div>

              <div className="max-h-[min(24rem,58vh)] overflow-y-auto p-1.5" role="listbox">
                {results.length ? (
                  results.map((result, index) => (
                    <a
                      key={result.href}
                      href={result.href}
                      role="option"
                      aria-selected={index === activeIndex}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={
                        "flex items-start justify-between gap-4 rounded-md px-3 py-2.5 no-underline transition-colors " +
                        (index === activeIndex ? "bg-surface-2 text-fg" : "text-fg-muted")
                      }
                    >
                      <span className="min-w-0">
                        <span className="block font-medium text-fg">{result.title}</span>
                        <span className="mt-0.5 block truncate text-sm text-fg-muted">
                          {result.description}
                        </span>
                      </span>
                      <span className="shrink-0 pt-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-fg-subtle">
                        {result.section}
                      </span>
                    </a>
                  ))
                ) : (
                  <div className="px-4 py-12 text-center text-sm text-fg-muted">
                    No documentation found for “{query}”.
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-[0.7rem] text-fg-subtle">
                <span>↑↓ Navigate</span>
                <span>↵ Open</span>
                <span className="ml-auto">{results.length} results</span>
              </div>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}
