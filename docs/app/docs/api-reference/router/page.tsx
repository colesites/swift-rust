export const metadata = { title: "Router" };

export default function RouterRefPage() {
  return (
    <article className="prose">
      <h1>Router</h1>
      <p>
        Imports for the router, available from <code>swift-rust/router</code>.
      </p>

      <h2>Functions</h2>
      <ul>
        <li>
          <code>notFound()</code> — throw a 404 from a page or layout
        </li>
        <li>
          <code>redirect(url)</code> — 307 redirect
        </li>
        <li>
          <code>permanentRedirect(url)</code> — 308 permanent redirect
        </li>
        <li>
          <code>revalidatePath(path)</code> — purge a route's cache
        </li>
        <li>
          <code>revalidateTag(tag)</code> — purge tagged cache entries
        </li>
      </ul>

      <h2>Classes</h2>
      <ul>
        <li>
          <code>NotFoundError</code> — thrown by <code>notFound()</code>
        </li>
        <li>
          <code>RedirectError</code> — thrown by <code>redirect()</code>
        </li>
      </ul>

      <h2>Types</h2>
      <ul>
        <li>
          <code>LayoutProps</code>
        </li>
        <li>
          <code>PageProps</code>
        </li>
        <li>
          <code>RouteHandler</code>
        </li>
        <li>
          <code>RouteHandlerContext</code>
        </li>
      </ul>
    </article>
  );
}
