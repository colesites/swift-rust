import { DocArticle } from "@/app/components/doc-article";
export const metadata = { title: "Data fetching" };

export default function DataFetchingPage() {
  return (
    <DocArticle>
      <h1>Data fetching</h1>
      <p>
        Pages can be <code>async</code> functions. The framework awaits them before rendering, which
        means you can <code>await</code> data directly in your components — no{" "}
        <code>useEffect</code> or data-fetching library required.
      </p>

      <h2>Fetching in a page</h2>
      <div className="code-block">
        <div className="code-block-header">
          <span>app/blog/page.tsx</span>
        </div>
        <pre>
          <code>{`async function getPosts() {
  const res = await fetch("https://api.example.com/posts");
  return res.json();
}

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <ul>
      {posts.map((p) => <li key={p.id}>{p.title}</li>)}
    </ul>
  );
}`}</code>
        </pre>
      </div>

      <h2>Fetching in a layout</h2>
      <p>Layouts can also be async. The data is fetched once and shared across all child pages.</p>

      <h2>Loading UI</h2>
      <p>
        For a non-blocking experience, combine <code>loading.tsx</code> with Suspense boundaries:
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>app/dashboard/page.tsx</span>
        </div>
        <pre>
          <code>{`import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <RecentActivity />
    </Suspense>
  );
}

async function RecentActivity() {
  const data = await fetch("https://api.example.com/activity").then((r) => r.json());
  return <ul>{data.map(...)}</ul>;
}`}</code>
        </pre>
      </div>

      <h2>Route handlers (API routes)</h2>
      <p>
        For pure data endpoints, create a <code>route.ts</code> file. Export functions named after
        HTTP methods:
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>app/api/posts/route.ts</span>
        </div>
        <pre>
          <code>{`import type { RouteHandler } from "swift-rust/router";

export const GET: RouteHandler = async ({ request }) => {
  const posts = await db.posts.findMany();
  return Response.json(posts);
};

export const POST: RouteHandler = async ({ request }) => {
  const body = await request.json();
  const post = await db.posts.create(body);
  return Response.json(post, { status: 201 });
};`}</code>
        </pre>
      </div>

      <h2>Next steps</h2>
      <p>
        Continue to <a href="/docs/getting-started/styling">Styling</a>.
      </p>
    </DocArticle>
  );
}
