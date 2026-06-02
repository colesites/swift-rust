export const metadata = { title: "Error handling" };

export default function ErrorHandlingPage() {
  return (
    <article className="prose">
      <h1>Error handling</h1>
      <p>
        Swift Rust gives you three tools to handle errors: <code>error.tsx</code> boundaries for
        runtime errors, <code>notFound()</code> for missing data, and <code>redirect()</code> for
        control flow.
      </p>

      <h2>Error boundaries</h2>
      <p>
        Create an <code>error.tsx</code> file in any segment. The closest one in the tree catches
        the error and renders the fallback UI.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>app/dashboard/error.tsx</span>
        </div>
        <pre>
          <code>{`"use client";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <pre>{error.message}</pre>
      <button onClick={reset}>Try again</button>
    </div>
  );
}`}</code>
        </pre>
      </div>

      <h2>
        Throwing <code>notFound()</code>
      </h2>
      <p>
        From a page or layout, call <code>notFound()</code> to render the closest{" "}
        <code>not-found.tsx</code>. The function throws a special <code>NotFoundError</code> that
        the framework catches and converts to a 404 response.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>app/blog/[slug]/page.tsx</span>
        </div>
        <pre>
          <code>{`import { notFound } from "swift-rust/router";
import { getPost } from "@/lib/posts";

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();
  return <article>{post.content}</article>;
}`}</code>
        </pre>
      </div>

      <h2>Redirects</h2>
      <p>
        Use <code>redirect(url)</code> to send the user to a different URL, or{" "}
        <code>permanentRedirect(url)</code> for a 308 (permanent) redirect.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>usage</span>
        </div>
        <pre>
          <code>{`import { redirect, permanentRedirect } from "swift-rust/router";

if (!session) redirect("/login");
if (post.oldSlug) permanentRedirect(\`/blog/\${post.newSlug}\`);`}</code>
        </pre>
      </div>

      <h2>Global error overlay</h2>
      <p>
        In development, the framework shows a Rust-styled error overlay with the source frame, the
        file and line number, and a button to open the file in your editor.
      </p>
    </article>
  );
}
