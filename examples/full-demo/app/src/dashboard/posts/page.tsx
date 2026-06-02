import type { Metadata } from "swift-rust";
import { Link } from "swift-rust";
import { posts } from "@/lib/posts";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Posts" };

export default function PostsPage() {
  return (
    <div className="px-6 py-10 sm:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.75rem] font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]">
            Dashboard
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Posts</h1>
          <p className="mt-1 text-[var(--color-fg-muted)]">{posts.length} total</p>
        </div>
        <Link href="/dashboard/posts/new" className="btn btn-primary btn-sm">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          New post
        </Link>
      </div>

      <div className="mt-8 card overflow-hidden">
        <table className="w-full text-left text-[0.875rem]">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)] text-[0.7rem] font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]">
              <th className="px-5 py-3 font-semibold">Title</th>
              <th className="px-5 py-3 font-semibold">Author</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Tags</th>
              <th className="px-5 py-3 text-right font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.slug} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-2)]">
                <td className="px-5 py-3.5">
                  <Link
                    href={`/dashboard/posts/${p.slug}`}
                    className="font-medium text-[var(--color-fg)] hover:text-[var(--color-accent)]"
                  >
                    {p.title}
                  </Link>
                </td>
                <td className="px-5 py-3.5 text-[var(--color-fg-muted)]">{p.author.name}</td>
                <td className="px-5 py-3.5">
                  <span className="badge badge-success badge-dot">Published</span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {p.tags.map((t) => (
                      <span key={t} className="badge">
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right text-[var(--color-fg-subtle)]">
                  <time dateTime={p.date}>{formatDate(p.date)}</time>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
