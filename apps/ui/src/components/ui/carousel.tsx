"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function Carousel({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  return (
    <div className={cn("relative", className)}>
      <div
        ref={ref}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <button
        type="button"
        aria-label="Previous"
        onClick={() => scroll(-1)}
        className="absolute -left-3 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-sm hover:bg-muted"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => scroll(1)}
        className="absolute -right-3 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-sm hover:bg-muted"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </div>
  );
}

export function CarouselItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("min-w-0 shrink-0 grow-0 basis-full snap-start sm:basis-1/2 lg:basis-1/3", className)} {...props} />;
}
