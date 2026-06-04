import { Link } from "swift-rust";

export default function GlobalNotFound() {
  return (
    <div className="container-page py-24 sm:py-32">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-mono text-[0.875rem] font-medium text-[var(--color-accent)]">404</p>
        <h1 className="mt-3 text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
          Page not found.
        </h1>
        <p className="mt-5 text-pretty text-lg leading-relaxed text-[var(--color-fg-muted)]">
          The page you were looking for has moved, was renamed, or never existed.
        </p>
        <div className="mt-8 flex justify-center gap-2">
          <Link href="/" className="btn btn-primary">
            Back to home
          </Link>
          <Link href="/blog" className="btn btn-outline">
            Read the blog
          </Link>
        </div>
      </div>
    </div>
  );
}
