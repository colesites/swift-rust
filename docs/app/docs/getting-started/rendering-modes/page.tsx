export const metadata = { title: "Rendering modes" };

export default function RenderingModesPage() {
  return (
    <article className="prose">
      <h1>Rendering modes</h1>
      <p>
        Swift Rust supports four rendering modes. You pick one when you scaffold your project, and
        you can change it later in <code>swift-rust.config.json</code>.
      </p>

      <h2>
        <code>ssr</code> — Pure server-rendered HTML
      </h2>
      <p>
        The default for content sites. Every request is rendered on the server and sent as plain
        HTML. No client-side JavaScript is shipped to the browser. This is the fastest first paint
        and the lowest memory footprint.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>swift-rust.config.json</span>
        </div>
        <pre>
          <code>{`{
  "rendering": "ssr"
}`}</code>
        </pre>
      </div>
      <p>Best for: blogs, marketing pages, documentation, e-commerce product pages.</p>

      <h2>
        <code>ssr-wasm</code> — SSR with WASM hydration
      </h2>
      <p>
        The default for app-style sites. Server renders the initial HTML, then a WebAssembly bundle
        hydrates the page in the browser. React components run in both the Rust runtime (for SSR)
        and the browser (after hydration), with the same code.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>swift-rust.config.json</span>
        </div>
        <pre>
          <code>{`{
  "rendering": "ssr-wasm"
}`}</code>
        </pre>
      </div>
      <p>Best for: dashboards, interactive apps, anything that needs client-side state.</p>

      <h2>
        <code>ssr-htmx</code> — SSR with HTMX
      </h2>
      <p>
        Server renders the HTML, and HTMX handles progressive enhancement. Forms, links, and partial
        updates work without writing client-side JavaScript. The whole UI is interactive via HTML
        attributes like <code>hx-get</code>, <code>hx-post</code>, <code>hx-target</code>.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>swift-rust.config.json</span>
        </div>
        <pre>
          <code>{`{
  "rendering": "ssr-htmx"
}`}</code>
        </pre>
      </div>
      <p>Best for: CRUD apps, admin panels, anything where you want to keep client JS minimal.</p>

      <h2>
        <code>wasm</code> — Full WASM SPA
      </h2>
      <p>
        The whole app is compiled to WebAssembly and runs in the browser. The server only ships a
        shell HTML and the WASM bundle. After the initial load, navigation is client-side.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>swift-rust.config.json</span>
        </div>
        <pre>
          <code>{`{
  "rendering": "wasm"
}`}</code>
        </pre>
      </div>
      <p>
        Best for: highly interactive apps, when you want a single binary that can serve multiple
        SPAs.
      </p>

      <h2>Choosing a mode</h2>
      <p>
        If you're not sure, start with <code>ssr-wasm</code>. It's the most flexible and matches the
        behavior of most modern Next.js apps.
      </p>

      <h2>Next steps</h2>
      <p>
        Continue to <a href="/docs/getting-started/data-fetching">Data fetching</a>.
      </p>
    </article>
  );
}
