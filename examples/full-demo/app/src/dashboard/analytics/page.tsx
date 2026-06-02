import type { Metadata } from "swift-rust";
import { trafficSeries, trafficMax } from "@/lib/stats";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = { title: "Analytics" };

const SOURCES = [
  { name: "Direct", value: 412000, pct: 42 },
  { name: "Search", value: 281000, pct: 28 },
  { name: "Social", value: 175000, pct: 18 },
  { name: "Referral", value: 121000, pct: 12 },
];

const PAGES = [
  { path: "/", views: 982000, avg: "1:42" },
  { path: "/blog/introducing-swift-rust", views: 218000, avg: "3:18" },
  { path: "/dashboard", views: 154000, avg: "2:05" },
  { path: "/fonts", views: 98000, avg: "0:48" },
  { path: "/blog/streaming-ssr-in-rust", views: 87000, avg: "4:12" },
];

export default function AnalyticsPage() {
  return (
    <div className="px-6 py-10 sm:px-10">
      <p className="text-[0.75rem] font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]">
        Dashboard
      </p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Analytics</h1>
      <p className="mt-1 text-[var(--color-fg-muted)]">Last 7 days, all projects combined.</p>

      <div className="mt-8 card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[0.95rem] font-semibold">Requests over time</h2>
          <span className="text-[0.75rem] text-[var(--color-fg-subtle)]">Total: {formatNumber(trafficSeries.reduce((s, d) => s + d.requests, 0))}</span>
        </div>
        <div className="mt-6 flex h-64 items-end gap-3">
          {trafficSeries.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-md bg-[var(--color-accent)] transition-opacity hover:opacity-80"
                style={{ height: `${(d.requests / trafficMax) * 100}%` }}
                title={`${d.requests.toLocaleString()} requests`}
              />
              <span className="text-[0.75rem] font-medium text-[var(--color-fg-subtle)]">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-[0.95rem] font-semibold">Traffic sources</h2>
          <ul className="mt-5 space-y-4">
            {SOURCES.map((s) => (
              <li key={s.name}>
                <div className="flex items-center justify-between text-[0.875rem]">
                  <span className="font-medium">{s.name}</span>
                  <span className="font-mono text-[var(--color-fg-muted)]">
                    {formatNumber(s.value)}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                  <div
                    className="h-full rounded-full bg-[var(--color-accent)]"
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <h2 className="text-[0.95rem] font-semibold">Top pages</h2>
          <ul className="mt-5 divide-y divide-[var(--color-border)]">
            {PAGES.map((p) => (
              <li key={p.path} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <span className="truncate font-mono text-[0.8125rem] text-[var(--color-fg)]">
                  {p.path}
                </span>
                <div className="flex items-center gap-6 text-[0.8125rem]">
                  <span className="font-mono text-[var(--color-fg-muted)]">
                    {formatNumber(p.views)}
                  </span>
                  <span className="w-12 text-right font-mono text-[var(--color-fg-subtle)]">{p.avg}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
