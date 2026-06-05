import type { Metadata } from "swift-rust";
import { Link } from "swift-rust";
import Image from "swift-rust/image";
import { getAllTags, posts } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { BLUR } from "@/lib/blur";

export const metadata: Metadata = {
  title: "Blog",
  description: "Field notes, release announcements, and the occasional rant about bundlers.",
};

export default function BlogIndexPage() {
  const tags = getAllTags();
  const [featured, ...rest] = posts;

  return (
    <div className="container-page py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Blog</h1>
        <p className="mt-4 text-fg-muted">
          Field notes, release announcements, and the occasional rant about bundlers.
        </p>
      </div>

      {featured ? (
        <Link
          href={`/blog/${featured.slug}`}
          className="group mt-16 grid gap-8 border-b border-border pb-16 lg:grid-cols-[1.3fr_1fr] lg:items-center"
        >
          <div>
            <span className="badge badge-accent">Featured</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-fg group-hover:text-accent sm:text-4xl">
              {featured.title}
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-fg-muted">
              {featured.excerpt}
            </p>
            <div className="mt-6 flex items-center gap-3 text-[0.8125rem] text-fg-subtle">
              <span>{featured.author.name}</span>
              <span>·</span>
              <time dateTime={featured.date}>{formatDate(featured.date)}</time>
              <span>·</span>
              <span>{featured.readingTime}</span>
            </div>
          </div>
          {featured.cover ? (
            <Image
              src={featured.cover}
              alt={featured.title}
              width={1200}
              height={630}
              placeholder="blur"
              blurDataURL={BLUR}
              className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border object-cover"
            />
          ) : (
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-accent-soft via-surface to-surface-2" />
          )}
        </Link>
      ) : null}

      <div className="mt-12 flex flex-wrap items-center gap-2">
        <span className="text-[0.75rem] font-medium uppercase tracking-wider text-fg-subtle">
          Tags:
        </span>
        <Link
          href="/blog"
          className="badge hover:border-border-strong hover:bg-surface-2"
        >
          All
        </Link>
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/blog/tag/${tag}`}
            className="badge hover:border-border-strong hover:bg-surface-2"
          >
            {tag}
          </Link>
        ))}
      </div>

      <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
        {rest.map((post) => (
          <li key={post.slug} className="bg-surface">
            <Link
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col p-6 transition-colors hover:bg-surface-2"
            >
              <div className="flex items-center gap-2 text-[0.75rem] text-fg-subtle">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span>·</span>
                <span>{post.readingTime}</span>
              </div>
              <h3 className="mt-3 text-[1.125rem] font-semibold text-fg group-hover:text-accent">
                {post.title}
              </h3>
              <p className="mt-2 flex-1 text-[0.875rem] leading-relaxed text-fg-muted">
                {post.excerpt}
              </p>
              <div className="mt-6 flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span key={tag} className="badge">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
