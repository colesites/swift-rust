"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: keyof T & string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

export function DataTable<T extends Record<string, React.ReactNode>>({
  columns,
  data,
  className,
}: {
  columns: DataTableColumn<T>[];
  data: T[];
  className?: string;
}) {
  const [sort, setSort] = React.useState<{ key: string; dir: 1 | -1 } | null>(null);

  const rows = React.useMemo(() => {
    if (!sort) return data;
    const sorted = [...data].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      return String(av).localeCompare(String(bv), undefined, { numeric: true }) * sort.dir;
    });
    return sorted;
  }, [data, sort]);

  const toggleSort = (key: string) =>
    setSort((s) => (s?.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }));

  return (
    <div className={cn("w-full overflow-auto rounded-lg border border-border", className)}>
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={cn("h-10 px-3 text-left align-middle text-xs font-semibold uppercase tracking-wider text-muted-foreground", c.className)}>
                {c.sortable ? (
                  <button type="button" onClick={() => toggleSort(c.key)} className="inline-flex items-center gap-1 hover:text-foreground">
                    {c.header}
                    <span className="text-[0.7rem]">{sort?.key === c.key ? (sort.dir === 1 ? "▲" : "▼") : "↕"}</span>
                  </button>
                ) : (
                  c.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {rows.map((row, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <tr key={i} className="border-b border-border transition-colors hover:bg-muted">
              {columns.map((c) => (
                <td key={c.key} className={cn("p-3 align-middle", c.className)}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
