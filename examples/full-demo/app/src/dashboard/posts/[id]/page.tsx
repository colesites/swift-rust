import type { Metadata } from "swift-rust";
import { notFound } from "swift-rust/router";
import { Link } from "swift-rust";
import { getPost, posts } from "@/lib/posts";
import { formatDate } from "@/lib/format";

export function generateStaticParams() {
  return posts.map((p) => ({ id: p.slug }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const post = getPost(params.id);
  if (!post) return { title: "Post not found" };
  return { title: `Edit: ${post.title}` };
}

export default function DashboardPostPage({ params }: { params: { id: string } }) {
  const post = getPost(params.id);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:px-10">
      <Link
        href="/dashboard/posts"
        className="inline-flex items-center gap-1.5 text-[0.875rem] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        All posts
      </Link>

      <div className="mt-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.75rem] font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]">
            Post
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{post.title}</h1>
          <p className="mt-2 text-[0.875rem] text-[var(--color-fg-muted)]">
            By {post.author.name} · {formatDate(post.date)} · {post.readingTime}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-success badge-dot">Published</span>
          <Link href={`/blog/${post.slug}`} className="btn btn-outline btn-sm">
            View live
          </Link>
        </div>
      </div>

      <div className="mt-8 card p-6">
        <h2 className="text-[0.95rem] font-semibold">Excerpt</h2>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-[var(--color-fg-muted)]">
          {post.excerpt}
        </p>
      </div>

      <div className="mt-6 card p-6">
        <h2 className="text-[0.95rem] font-semibold">Tags</h2>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <span key={t} className="badge badge-accent">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 card p-6">
        <h2 className="text-[0.95rem] font-semibold">Body preview</h2>
        <div className="mt-3 max-h-72 overflow-y-auto text-[0.875rem] leading-relaxed text-[var(--color-fg-muted)]">
          {post.body.split("\n\n").map((p, i) => (
            <p key={i} className="mb-3">
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
