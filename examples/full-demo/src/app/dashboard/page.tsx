import { formatNumber, formatPercent, relativeTime } from "@/lib/format";
import { posts } from "@/lib/posts";
import { stats, trafficMax, trafficSeries } from "@/lib/stats";
import type { Metadata } from "swift-rust";
import { Link } from "swift-rust";

export const metadata: Metadata = { title: "Dashboard" };

const ACTIVITY = [
  {
    who: "alex@swift-rust.dev",
    what: "published",
    target: "Streaming SSR in Rust",
    when: "2026-06-01T08:32:00Z",
  },
  {
    who: "maria@swift-rust.dev",
    what: "updated",
    target: "Geist font spec",
    when: "2026-05-31T15:10:00Z",
  },
  {
    who: "jordan@swift-rust.dev",
    what: "deployed",
    target: "v0.0.9-rc3",
    when: "2026-05-31T09:45:00Z",
  },
  {
    who: "priya@swift-rust.dev",
    what: "merged",
    target: "feat: edge streaming",
    when: "2026-05-30T18:22:00Z",
  },
  {
    who: "sam@swift-rust.dev",
    what: "commented on",
    target: "binary size regression",
    when: "2026-05-30T11:08:00Z",
  },
];

export default function DashboardOverviewPage() {
  return (
    <div className="px-6 py-10 sm:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.75rem] font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]">
            Overview
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Welcome back, Alex</h1>
          <p className="mt-1 text-[var(--color-fg-muted)]">
            Here&apos;s what happened across your projects in the last 30 days.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/posts/new" className="btn btn-outline btn-sm">
            New post
          </Link>
          <Link href="/dashboard/settings" className="btn btn-primary btn-sm">
            Settings
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-[var(--color-surface)] p-6">
            <p className="text-[0.8125rem] text-[var(--color-fg-muted)]">{s.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{s.value}</p>
            <div className="mt-3 flex items-center gap-2 text-[0.75rem]">
              <span
                className={`inline-flex items-center gap-0.5 font-medium ${
                  s.delta >= 0 ? "text-[#16a34a]" : "text-[#dc2626]"
                }`}
              >
                {s.delta >= 0 ? "↑" : "↓"} {formatPercent(Math.abs(s.delta))}
              </span>
              <span className="text-[var(--color-fg-subtle)]">{s.context}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[0.95rem] font-semibold">Traffic</h2>
              <p className="text-[0.8125rem] text-[var(--color-fg-muted)]">Last 7 days</p>
            </div>
            <div className="flex items-center gap-1 text-[0.75rem]">
              <span className="badge badge-dot badge-success">Healthy</span>
            </div>
          </div>
          <div className="mt-6 flex h-48 items-end gap-2">
            {trafficSeries.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-[var(--color-accent)]/80 transition-colors hover:bg-[var(--color-accent)]"
                  style={{ height: `${(d.requests / trafficMax) * 100}%` }}
                  title={`${d.requests.toLocaleString()} requests`}
                />
                <span className="text-[0.7rem] font-medium text-[var(--color-fg-subtle)]">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-4 text-[0.8125rem]">
            <span className="text-[var(--color-fg-muted)]">Total</span>
            <span className="font-mono font-medium">
              {formatNumber(trafficSeries.reduce((s, d) => s + d.requests, 0))}
            </span>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-[0.95rem] font-semibold">Recent activity</h2>
          <ul className="mt-4 -mx-2 divide-y divide-[var(--color-border)]">
            {ACTIVITY.map((a, i) => (
              <li key={i} className="flex items-start gap-3 px-2 py-3">
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent)]" />
                <div className="min-w-0 flex-1">
                  <p className="text-[0.875rem] leading-snug text-[var(--color-fg)]">
                    <span className="font-medium">{a.who}</span>{" "}
                    <span className="text-[var(--color-fg-muted)]">{a.what}</span>{" "}
                    <span className="font-medium">{a.target}</span>
                  </p>
                  <p className="mt-0.5 text-[0.75rem] text-[var(--color-fg-subtle)]">
                    {relativeTime(a.when)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[0.95rem] font-semibold">Latest posts</h2>
          <Link
            href="/dashboard/posts"
            className="text-[0.8125rem] font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
          >
            View all
          </Link>
        </div>
        <table className="mt-4 w-full text-left text-[0.875rem]">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-[0.7rem] font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]">
              <th className="pb-2 font-semibold">Title</th>
              <th className="pb-2 font-semibold">Author</th>
              <th className="pb-2 font-semibold">Status</th>
              <th className="pb-2 text-right font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {posts.slice(0, 4).map((p) => (
              <tr key={p.slug} className="border-b border-[var(--color-border)] last:border-0">
                <td className="py-3 pr-4">
                  <Link
                    href={`/blog/${p.slug}`}
                    className="font-medium text-[var(--color-fg)] hover:text-[var(--color-accent)]"
                  >
                    {p.title}
                  </Link>
                </td>
                <td className="py-3 pr-4 text-[var(--color-fg-muted)]">{p.author.name}</td>
                <td className="py-3 pr-4">
                  <span className="badge badge-success badge-dot">Published</span>
                </td>
                <td className="py-3 text-right text-[var(--color-fg-subtle)]">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
