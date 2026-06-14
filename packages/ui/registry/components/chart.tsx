import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChartDatum {
  label: string;
  value: number;
}

// A dependency-free SVG bar chart. For richer charts, swap in a charting lib.
export function BarChart({
  data,
  height = 180,
  className,
}: {
  data: ChartDatum[];
  height?: number;
  className?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const barW = 100 / (data.length * 1.6);
  const gap = barW * 0.6;
  return (
    <div className={cn("w-full", className)}>
      <svg viewBox={`0 0 100 ${height / 2}`} preserveAspectRatio="none" className="h-44 w-full overflow-visible">
        {data.map((d, i) => {
          const h = (d.value / max) * (height / 2 - 6);
          const x = i * (barW + gap) + gap;
          return (
            <rect
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              x={x}
              y={height / 2 - h}
              width={barW}
              height={h}
              rx={1}
              className="fill-primary"
            />
          );
        })}
      </svg>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        {data.map((d, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <span key={i} className="flex-1 text-center">{d.label}</span>
        ))}
      </div>
    </div>
  );
}
