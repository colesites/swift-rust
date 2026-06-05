import { Link } from "swift-rust";

export default function PostNotFound() {
  return (
    <div className="mx-auto max-w-md px-6 py-20 text-center sm:px-10">
      <p className="text-[0.75rem] font-semibold uppercase tracking-wider text-fg-subtle">
        404
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Post not found</h1>
      <p className="mt-3 text-fg-muted">
        That post doesn&apos;t exist, was unpublished, or you don&apos;t have access.
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <Link href="/dashboard/posts" className="btn btn-primary btn-sm">
          Back to posts
        </Link>
        <Link href="/dashboard" className="btn btn-outline btn-sm">
          Dashboard
        </Link>
      </div>
    </div>
  );
}
