import type { Metadata } from "swift-rust";
import { Link } from "swift-rust";
import Image from "swift-rust/image";
import { BLUR } from "@/lib/blur";
import { formatDate } from "@/lib/format";
import { getAllTags, posts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Field notes, release announcements, and the occasional rant about bundlers.",
};

export default function BlogIndexPage() {
  const tags = getAllTags();
  const [featured, ...rest] = posts;

  return (
    <div className="container-page py-12 sm:py-16">
      <header className="grid gap-5 border-b border-border pb-10 lg:grid-cols-[0.7fr_1fr] lg:items-end">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent">
            Engineering journal
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Blog</h1>
        </div>
        <p className="max-w-xl text-pretty text-base leading-relaxed text-fg-muted lg:justify-self-end lg:text-lg">
          Field notes from the team building a faster, simpler full-stack React framework with Rust
          and Bun.
        </p>
      </header>

      {featured ? (
        <Link
          href={`/blog/${featured.slug}`}
          className="group mt-10 grid overflow-hidden rounded-[1.5rem] border border-border bg-surface shadow-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div className="order-2 flex flex-col justify-center p-6 sm:p-9 lg:order-1 lg:p-10">
            <div className="flex items-center gap-3">
              <span className="badge badge-accent">Featured story</span>
              <time className="text-[0.75rem] text-fg-subtle" dateTime={featured.date}>
                {formatDate(featured.date)}
              </time>
            </div>
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-fg transition-colors group-hover:text-accent sm:text-4xl">
              {featured.title}
            </h2>
            <p className="mt-4 max-w-xl text-pretty leading-relaxed text-fg-muted">
              {featured.excerpt}
            </p>
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-5">
              <div className="text-[0.8125rem] text-fg-subtle">
                <span className="font-medium text-fg">{featured.author.name}</span>
                <span className="mx-2">·</span>
                <span>{featured.readingTime}</span>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-fg text-bg transition-transform duration-300 group-hover:translate-x-1">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </div>
          <div className="order-1 overflow-hidden border-b border-border bg-surface-2 lg:order-2 lg:border-b-0 lg:border-l">
            {featured.cover ? (
              <Image
                src={featured.cover}
                alt={featured.title}
                width={1200}
                height={630}
                placeholder="blur"
                blurDataURL={BLUR}
                className="aspect-[16/10] h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] lg:min-h-[23rem]"
              />
            ) : (
              <div className="aspect-[16/10] h-full min-h-[23rem] bg-gradient-to-br from-accent-soft via-surface to-surface-2" />
            )}
          </div>
        </Link>
      ) : null}

      <section className="mt-16">
        <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent">
              From the team
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Latest writing
            </h2>
          </div>
          <p className="text-sm text-fg-subtle">{rest.length} articles</p>
        </div>

        <nav
          aria-label="Filter posts by topic"
          className="mt-6 flex items-start gap-4 rounded-xl border border-border bg-surface-2/70 p-3"
        >
          <span className="shrink-0 px-2 py-1.5 text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle">
            Topics
          </span>
          <div className="flex flex-wrap gap-1.5">
            <Link href="/blog" aria-current="page" className="badge badge-accent">
              All
            </Link>
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag}`}
                className="badge bg-surface hover:border-border-strong hover:bg-bg"
              >
                {tag}
              </Link>
            ))}
          </div>
        </nav>

        <ul className="mt-6 grid auto-rows-fr gap-4 sm:grid-cols-2">
          {rest.map((post, index) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-sm sm:p-7"
              >
                <div className="flex items-center justify-between gap-4 text-[0.75rem] text-fg-subtle">
                  <div className="flex items-center gap-2">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span>·</span>
                    <span>{post.readingTime}</span>
                  </div>
                  <span className="font-mono text-[0.7rem]">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-xl font-semibold leading-snug tracking-tight text-fg transition-colors group-hover:text-accent">
                  {post.title}
                </h3>
                <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-fg-muted">
                  {post.excerpt}
                </p>
                <div className="mt-7 flex items-end justify-between gap-4 border-t border-border pt-5">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span key={tag} className="badge">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0 text-fg-subtle transition-[color,transform] group-hover:translate-x-1 group-hover:text-accent"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
