export const metadata = { title: "Installation" };

export default function InstallationPage() {
  return (
    <article className="prose">
      <h1>Installation</h1>
      <p>
        Get started with Swift Rust in less than a minute. You'll need{" "}
        <a href="https://bun.sh">Bun 1.3+</a> (or Node 20+). Rust 1.85+ is required if you want to
        build native binaries.
      </p>

      <h2>Scaffold a new project</h2>
      <p>
        The fastest way to start is with the <code>create-swift-rust</code> scaffolder. It asks a
        few questions (or accepts flags for a non-interactive run) and creates a new project in the
        current directory.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>terminal</span>
        </div>
        <pre>
          <code>{`bun create swift-rust@latest my-app
cd my-app
bun install
bun run dev`}</code>
        </pre>
      </div>

      <h2>Non-interactive mode</h2>
      <p>
        Every prompt can be replaced with a flag. Useful for CI, scripts, or when you know exactly
        what you want.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>terminal</span>
        </div>
        <pre>
          <code>{`bun create swift-rust@latest my-app \\
  --ts \\
  --tailwind \\
  --shadcn \\
  --renderer ssr-wasm \\
  --import-alias "@/*" \\
  --yes`}</code>
        </pre>
      </div>

      <h2>System requirements</h2>
      <ul>
        <li>
          <strong>Bun</strong> 1.3.0+ (or Node.js 20+)
        </li>
        <li>
          <strong>Rust</strong> 1.85+ (only required for native builds)
        </li>
        <li>
          <strong>Linux, macOS, or Windows</strong>
        </li>
      </ul>

      <h2>What gets installed</h2>
      <p>The scaffolder creates a project with these dependencies:</p>
      <ul>
        <li>
          <code>swift-rust</code> — the framework
        </li>
        <li>
          <code>react</code> and <code>react-dom</code> — for components and pages
        </li>
        <li>
          <code>clsx</code> and <code>tailwind-merge</code> — for the <code>cn()</code> utility
          (shadcn only)
        </li>
        <li>
          <code>tailwindcss</code> — for styling (optional)
        </li>
        <li>
          <code>typescript</code> — for type checking (TS only)
        </li>
      </ul>

      <h2>Next steps</h2>
      <p>
        Continue to <a href="/docs/getting-started/project-structure">Project structure</a> to learn
        how the file system maps to routes.
      </p>
    </article>
  );
}
