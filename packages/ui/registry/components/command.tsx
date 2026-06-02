"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface CommandItem {
  id: string;
  label: string;
  group?: string;
  onSelect?: () => void;
  shortcut?: string;
}

export function Command({
  items,
  onSelect,
  placeholder = "Type a command…",
  className,
}: {
  items: CommandItem[];
  onSelect?: (item: CommandItem) => void;
  placeholder?: string;
  className?: string;
}) {
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.label.toLowerCase().includes(q));
  }, [items, query]);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (item) {
        item.onSelect?.();
        onSelect?.(item);
      }
    }
  };

  return (
    <div className={cn("rounded-lg border border-[var(--ui-border)] bg-[var(--ui-surface)] shadow-md", className)}>
      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKey}
        placeholder={placeholder}
        className="w-full border-b border-[var(--ui-border)] bg-transparent px-4 py-3 text-sm outline-none placeholder:text-[var(--ui-fg-subtle)]"
      />
      <ul className="max-h-72 overflow-y-auto p-1">
        {filtered.length === 0 ? (
          <li className="px-3 py-6 text-center text-sm text-[var(--ui-fg-subtle)]">No results</li>
        ) : (
          filtered.map((item, i) => (
            <li
              key={item.id}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => {
                item.onSelect?.();
                onSelect?.(item);
              }}
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-sm px-3 py-2 text-sm",
                i === activeIndex && "bg-[var(--ui-accent-soft)] text-[var(--ui-accent)]",
              )}
            >
              <span>{item.label}</span>
              {item.shortcut ? (
                <kbd className="rounded border border-[var(--ui-border)] px-1 font-mono text-[0.6875rem]">
                  {item.shortcut}
                </kbd>
              ) : null}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
