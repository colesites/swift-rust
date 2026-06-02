export default function GettingStartedPage() {
  return (
    <article>
      <h1>Getting started</h1>
      <p>Create a new project with the scaffolder:</p>
      <pre>
        <code>{`bunx create-swift-rust@latest my-app
cd my-app
bun install
bun swift-rust dev`}</code>
      </pre>
      <h2>Pick a rendering mode</h2>
      <p>
        Swift Rust supports four rendering modes. You can change later in{" "}
        <code>swift-rust.config.json</code>:
      </p>
      <ul>
        <li>
          <strong>ssr</strong> — pure server-rendered HTML. No client JS.
        </li>
        <li>
          <strong>ssr-wasm</strong> — SSR first paint + WASM hydration. Default.
        </li>
        <li>
          <strong>ssr-htmx</strong> — SSR with HTMX islands for progressive enhancement.
        </li>
        <li>
          <strong>wasm</strong> — full WASM SPA with optional SSR shell.
        </li>
      </ul>
    </article>
  );
}
