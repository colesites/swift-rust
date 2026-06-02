"use client";
import { useEffect } from "react";
import { Link } from "swift-rust";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page py-24">
      <div className="mx-auto max-w-xl text-center">
        <span className="badge badge-dot" style={{ background: "#fef2f2", color: "#dc2626" }}>
          Runtime error
        </span>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight">Something went wrong.</h1>
        <p className="mt-4 text-[var(--color-fg-muted)]">
          We logged the error. You can try again, or head back to the homepage.
        </p>
        {error.digest ? (
          <p className="mt-2 font-mono text-[0.75rem] text-[var(--color-fg-subtle)]">
            digest: {error.digest}
          </p>
        ) : null}
        <div className="mt-8 flex justify-center gap-2">
          <button type="button" onClick={reset} className="btn btn-primary">
            Try again
          </button>
          <Link href="/" className="btn btn-outline">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
