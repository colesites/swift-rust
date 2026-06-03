import { DocArticle } from "@/app/components/doc-article";
export const metadata = { title: "Layouts & pages" };

export default function LayoutsPagesPage() {
  return (
    <DocArticle>
      <h1>Layouts &amp; pages</h1>
      <p>
        Pages and layouts are just React components. The framework wraps your page with the nearest
        layout chain and renders the result.
      </p>

      <h2>A page</h2>
      <p>
        The simplest page is a default-exported component. It receives <code>params</code> and{" "}
        <code>searchParams</code> as props.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>app/page.tsx</span>
        </div>
        <pre>
          <code>{`export default function HomePage() {
  return <h1>Hello, world</h1>;
}`}</code>
        </pre>
      </div>

      <h2>A layout</h2>
      <p>
        A layout wraps one or more pages. It receives <code>children</code> as a prop. The root
        layout (in <code>app/layout.tsx</code>) is required and must render{" "}
        <code>&lt;html&gt;</code> and <code>&lt;body&gt;</code>.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>app/layout.tsx</span>
        </div>
        <pre>
          <code>{`import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`}</code>
        </pre>
      </div>

      <h2>Nested layouts</h2>
      <p>
        Add a <code>layout.tsx</code> to any segment to wrap that segment and its children. Layouts
        are composed — they don't replace parent layouts.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>app/dashboard/layout.tsx</span>
        </div>
        <pre>
          <code>{`import type { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-[14rem_1fr]">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}`}</code>
        </pre>
      </div>

      <h2>Loading states</h2>
      <p>
        Export a <code>loading.tsx</code> to show a UI while the page is being prepared. In{" "}
        <code>ssr</code> mode, the framework will show this until the page is fully rendered.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>app/dashboard/loading.tsx</span>
        </div>
        <pre>
          <code>{`export default function Loading() {
  return <div className="animate-pulse">Loading dashboard…</div>;
}`}</code>
        </pre>
      </div>

      <h2>Error boundaries</h2>
      <p>
        Export an <code>error.tsx</code> to catch errors thrown by this segment and its children.
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
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}`}</code>
        </pre>
      </div>

      <h2>Not found</h2>
      <p>
        A <code>not-found.tsx</code> is rendered when no route matches. The closest one in the tree
        is used.
      </p>

      <h2>Next steps</h2>
      <p>
        Continue to <a href="/docs/getting-started/data-fetching">Data fetching</a>.
      </p>
    </DocArticle>
  );
}
