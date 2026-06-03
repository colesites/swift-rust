import { DocArticle } from "@/app/components/doc-article";
export const metadata = { title: "Project structure" };

export default function ProjectStructurePage() {
  return (
    <DocArticle>
      <h1>Project structure</h1>
      <p>
        Swift Rust uses a file-based router inspired by Next.js. The directory structure of your
        project determines the URL structure of your app.
      </p>

      <h2>The default layout</h2>
      <p>
        If you chose to use a <code>src/</code> directory in the scaffolder, your <code>app/</code>{" "}
        lives inside <code>src/</code>. Otherwise it's at the project root.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>my-app/</span>
        </div>
        <pre>
          <code>{`app/
  layout.tsx       # Root layout (wraps every route)
  page.tsx         # Homepage (/)
  loading.tsx      # Loading UI (optional)
  error.tsx        # Error boundary (optional)
  not-found.tsx    # 404 page
  about/
    page.tsx       # /about
  blog/
    page.tsx       # /blog
    [slug]/
      page.tsx     # /blog/:slug (dynamic)
  api/
    posts/
      route.ts     # GET/POST /api/posts
components/
  ui/              # shadcn-style components
  nav.tsx
  footer.tsx
lib/
  utils.ts         # cn() helper
public/
  favicon.svg
  images/
swift-rust.config.json
package.json
tsconfig.json`}</code>
        </pre>
      </div>

      <h2>Special files</h2>
      <p>Swift Rust recognizes these special filenames inside any route segment:</p>
      <ul>
        <li>
          <code>layout.tsx</code> — A layout that wraps the page and any nested routes.
        </li>
        <li>
          <code>page.tsx</code> — The page component. The URL is determined by the directory path.
        </li>
        <li>
          <code>loading.tsx</code> — A loading UI shown while data is being fetched.
        </li>
        <li>
          <code>error.tsx</code> — An error boundary for this segment and its children.
        </li>
        <li>
          <code>not-found.tsx</code> — A 404 page rendered when no route matches.
        </li>
        <li>
          <code>route.ts</code> — A request handler (replaces <code>page.tsx</code>). Exports{" "}
          <code>GET</code>, <code>POST</code>, etc.
        </li>
      </ul>

      <h2>Dynamic segments</h2>
      <p>
        Wrap a directory name in square brackets to create a dynamic segment. The captured value is
        passed to your page as <code>params</code>.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>app/blog/[slug]/page.tsx</span>
        </div>
        <pre>
          <code>{`export default function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  return <h1>Post: {params.slug}</h1>;
}`}</code>
        </pre>
      </div>

      <h2>Catch-all routes</h2>
      <p>
        Use <code>[...slug]</code> to capture all remaining path segments.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>app/docs/[...slug]/page.tsx</span>
        </div>
        <pre>
          <code>{`export default function CatchAllPage({
  params,
}: {
  params: { slug: string[] };
}) {
  return <h1>Path: {params.slug.join("/")}</h1>;
}`}</code>
        </pre>
      </div>

      <h2>Next steps</h2>
      <p>
        Continue to <a href="/docs/getting-started/layouts-and-pages">Layouts &amp; pages</a>.
      </p>
    </DocArticle>
  );
}
