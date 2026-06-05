import type { Metadata } from "swift-rust";
import { Link } from "swift-rust";

export const metadata: Metadata = { title: "New post" };

export default function NewPostPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10 sm:px-10">
      <Link
        href="/dashboard/posts"
        className="inline-flex items-center gap-1.5 text-[0.875rem] text-fg-muted hover:text-fg"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        All posts
      </Link>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight">New post</h1>
      <p className="mt-1 text-fg-muted">
        Compose a draft. Save without publishing, or hit publish when you&apos;re ready.
      </p>

      <form className="mt-8 space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-[0.8125rem] font-medium text-fg"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="A title for your post"
            className="input mt-2"
          />
        </div>
        <div>
          <label
            htmlFor="slug"
            className="block text-[0.8125rem] font-medium text-fg"
          >
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            placeholder="a-slug-for-your-post"
            className="input mt-2 font-mono"
          />
        </div>
        <div>
          <label
            htmlFor="excerpt"
            className="block text-[0.8125rem] font-medium text-fg"
          >
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            placeholder="A short summary that shows up on the blog index."
            className="textarea mt-2"
          />
        </div>
        <div>
          <label
            htmlFor="body"
            className="block text-[0.8125rem] font-medium text-fg"
          >
            Body
          </label>
          <textarea
            id="body"
            name="body"
            placeholder="Write your post here. Markdown is supported."
            className="textarea mt-2 min-h-[16rem] font-mono"
          />
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border pt-6">
          <Link href="/dashboard/posts" className="btn btn-outline">
            Cancel
          </Link>
          <button type="button" className="btn btn-ghost">
            Save draft
          </button>
          <button type="submit" className="btn btn-accent">
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}
