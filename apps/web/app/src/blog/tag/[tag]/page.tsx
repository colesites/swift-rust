import type { Metadata } from "swift-rust";
import { notFound } from "swift-rust/router";
import { Link } from "swift-rust";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { formatDate } from "@/lib/format";

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export function generateMetadata({ params }: { params: { tag: string } }): Metadata {
  return { title: `Tag: ${params.tag}`, description: `Posts tagged ${params.tag}` };
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const tag = params.tag;
  const tagged = getPostsByTag(tag);
  if (tagged.length === 0) notFound();

  return (
    <div className="container-page py-16 sm:py-20">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-[0.875rem] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        All posts
      </Link>
      <div className="mt-8">
        <p className="text-[0.75rem] font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]">
          Tag
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{tag}</h1>
        <p className="mt-3 text-[var(--color-fg-muted)]">
          {tagged.length} {tagged.length === 1 ? "post" : "posts"}
        </p>
      </div>

      <ul className="mt-12 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
        {tagged.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex items-start justify-between gap-6 py-6 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 text-[0.75rem] text-[var(--color-fg-subtle)]">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span>·</span>
                  <span>{post.readingTime}</span>
                </div>
                <h3 className="mt-2 text-[1.0625rem] font-semibold text-[var(--color-fg)] group-hover:text-[var(--color-accent)]">
                  {post.title}
                </h3>
                <p className="mt-1.5 text-[0.875rem] leading-relaxed text-[var(--color-fg-muted)]">
                  {post.excerpt}
                </p>
              </div>
              <svg
                viewBox="0 0 24 24"
                className="mt-1 h-4 w-4 shrink-0 text-[var(--color-fg-subtle)] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--color-fg)]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
