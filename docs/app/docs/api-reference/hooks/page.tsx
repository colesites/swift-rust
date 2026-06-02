export const metadata = { title: "Hooks" };

export default function HooksRefPage() {
  return (
    <article className="prose">
      <h1>Hooks</h1>
      <p>
        Swift Rust works with the standard React hooks. There are no framework-specific hooks beyond
        the React core.
      </p>

      <h2>
        <code>useRouter</code>
      </h2>
      <p>Access the current route and navigate programmatically.</p>
      <div className="code-block">
        <div className="code-block-header">
          <span>usage</span>
        </div>
        <pre>
          <code>{`"use client";
import { useRouter } from "swift-rust/router";

export function Component() {
  const router = useRouter();
  return <button onClick={() => router.push("/dashboard")}>Go</button>;
}`}</code>
        </pre>
      </div>

      <h2>
        <code>usePathname</code>
      </h2>
      <p>Get the current URL path.</p>
      <div className="code-block">
        <div className="code-block-header">
          <span>usage</span>
        </div>
        <pre>
          <code>{`"use client";
import { usePathname } from "swift-rust/router";

export function NavLink({ href, children }) {
  const pathname = usePathname();
  const active = pathname === href;
  return <a href={href} aria-current={active ? "page" : undefined}>{children}</a>;
}`}</code>
        </pre>
      </div>

      <h2>
        <code>useSearchParams</code>
      </h2>
      <p>Read the current URL's search params.</p>
      <div className="code-block">
        <div className="code-block-header">
          <span>usage</span>
        </div>
        <pre>
          <code>{`"use client";
import { useSearchParams } from "swift-rust/router";

export function Component() {
  const params = useSearchParams();
  return <p>Query: {params.get("q")}</p>;
}`}</code>
        </pre>
      </div>
    </article>
  );
}
