"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface UploadFile {
  id: number;
  name: string;
  size: number;
  progress: number;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({
  multiple = true,
  accept,
  onFiles,
  className,
}: {
  multiple?: boolean;
  accept?: string;
  onFiles?: (files: File[]) => void;
  className?: string;
}) {
  const [dragging, setDragging] = React.useState(false);
  const [files, setFiles] = React.useState<UploadFile[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const counter = React.useRef(0);

  const add = (list: FileList | null) => {
    if (!list) return;
    const arr = Array.from(list);
    onFiles?.(arr);
    const mapped = arr.map((f) => ({ id: ++counter.current, name: f.name, size: f.size, progress: 0 }));
    setFiles((prev) => (multiple ? [...prev, ...mapped] : mapped));
    // simulate upload progress
    for (const m of mapped) {
      let p = 0;
      const tick = setInterval(() => {
        p += Math.random() * 25 + 10;
        setFiles((prev) => prev.map((x) => (x.id === m.id ? { ...x, progress: Math.min(100, p) } : x)));
        if (p >= 100) clearInterval(tick);
      }, 220);
    }
  };

  return (
    <div className={cn("flex w-full max-w-md flex-col gap-3", className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          add(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors",
          dragging ? "border-primary bg-primary/5" : "border-border hover:border-border-strong hover:bg-muted/50",
        )}
      >
        <svg viewBox="0 0 24 24" className="size-7 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M12 16V4M7 9l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 16v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" strokeLinecap="round" />
        </svg>
        <span className="text-sm font-medium">Drag & drop or click to upload</span>
        <span className="text-xs text-muted-foreground">{accept ?? "Any file"}{multiple ? " · multiple" : ""}</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        className="hidden"
        onChange={(e) => add(e.target.files)}
      />
      {files.length > 0 && (
        <ul className="flex flex-col gap-2">
          {files.map((f) => (
            <li key={f.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-2.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">{f.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatSize(f.size)}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${f.progress}%` }} />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFiles((prev) => prev.filter((x) => x.id !== f.id))}
                aria-label="Remove"
                className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" /></svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
