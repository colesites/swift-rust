export const metadata = { title: "API routes" };

export default function ApiRoutesPage() {
  return (
    <article className="prose">
      <h1>API routes</h1>
      <p>
        API routes are <code>route.ts</code> files in the <code>app/</code> directory. They export
        functions named after HTTP methods (<code>GET</code>, <code>POST</code>, <code>PUT</code>,{" "}
        <code>DELETE</code>, etc).
      </p>

      <h2>A simple GET handler</h2>
      <div className="code-block">
        <div className="code-block-header">
          <span>app/api/posts/route.ts</span>
        </div>
        <pre>
          <code>{`import type { RouteHandler } from "swift-rust/router";

export const GET: RouteHandler = async ({ request }) => {
  const posts = await db.posts.findMany();
  return Response.json(posts);
};`}</code>
        </pre>
      </div>

      <h2>A POST handler with body parsing</h2>
      <div className="code-block">
        <div className="code-block-header">
          <span>app/api/posts/route.ts</span>
        </div>
        <pre>
          <code>{`import type { RouteHandler } from "swift-rust/router";

export const POST: RouteHandler = async ({ request }) => {
  const body = await request.json();
  const post = await db.posts.create({ data: body });
  return Response.json(post, { status: 201 });
};`}</code>
        </pre>
      </div>

      <h2>Dynamic API routes</h2>
      <p>
        Use the same <code>[param]</code> syntax as pages.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>app/api/posts/[id]/route.ts</span>
        </div>
        <pre>
          <code>{`import type { RouteHandler } from "swift-rust/router";

export const GET: RouteHandler = async ({ params }) => {
  const post = await db.posts.findUnique({ where: { id: params.id } });
  if (!post) return new Response("Not found", { status: 404 });
  return Response.json(post);
};`}</code>
        </pre>
      </div>

      <h2>Cookies and headers</h2>
      <p>
        The <code>request</code> object exposes <code>cookies</code>, <code>headers</code>, and
        standard Fetch API methods.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>usage</span>
        </div>
        <pre>
          <code>{`export const POST: RouteHandler = async ({ request }) => {
  const session = request.cookies.get("session")?.value;
  if (!session) return new Response("Unauthorized", { status: 401 });
  return Response.json({ ok: true });
};`}</code>
        </pre>
      </div>

      <h2>Custom responses</h2>
      <p>
        Return any standard <code>Response</code> object. The framework passes it through unchanged.
        For PDFs, use <code>Response.pdf(tree)</code>.
      </p>
    </article>
  );
}
