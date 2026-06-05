import { formatDate } from "@/lib/format";
import { BLUR } from "@/lib/blur";
import { getPost, posts } from "@/lib/posts";
import type { Metadata } from "swift-rust";
import Image from "swift-rust/image";
import { Link } from "swift-rust";
import { notFound } from "swift-rust/router";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article className="container-prose py-16 sm:py-20">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-[0.875rem] text-fg-muted transition-colors hover:text-fg"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M19 12H5M11 18l-6-6 6-6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        All posts
      </Link>

      <header className="mt-10 border-b border-border pb-10">
        <div className="flex flex-wrap items-center gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="badge badge-accent">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-5 text-pretty text-lg leading-relaxed text-fg-muted">
          {post.excerpt}
        </p>
        <div className="mt-8 flex items-center gap-3 text-[0.875rem] text-fg-subtle">
          <span className="font-medium text-fg">{post.author.name}</span>
          <span>·</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
      </header>

      {post.cover ? (
        <Image
          src={post.cover}
          alt={post.title}
          width={1200}
          height={630}
          placeholder="blur"
          blurDataURL={BLUR}
          loader={({ src }) => src}
          className="mt-10 aspect-1200/630 w-full rounded-2xl border border-border object-cover"
        />
      ) : null}

      <div className="prose prose-stone mt-10 max-w-none text-[1.0625rem] leading-[1.8] text-fg">
        {post.body.split("\n\n").map((paragraph, i) => (
          <p key={i} className="mb-6">
            {paragraph}
          </p>
        ))}
      </div>

      {related.length > 0 ? (
        <div className="mt-20 border-t border-border pt-12">
          <h2 className="text-[0.75rem] font-semibold uppercase tracking-wider text-fg-subtle">
            Keep reading
          </h2>
          <ul className="mt-6 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            {related.map((p) => (
              <li key={p.slug} className="bg-surface">
                <Link
                  href={`/blog/${p.slug}`}
                  className="group block p-5 transition-colors hover:bg-surface-2"
                >
                  <p className="text-[0.75rem] text-fg-subtle">
                    <time dateTime={p.date}>{formatDate(p.date)}</time>
                  </p>
                  <h3 className="mt-2 text-[1rem] font-semibold text-fg group-hover:text-accent">
                    {p.title}
                  </h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
