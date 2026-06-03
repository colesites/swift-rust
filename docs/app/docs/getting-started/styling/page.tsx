import { DocArticle } from "@/app/components/doc-article";
export const metadata = { title: "Styling" };

export default function StylingPage() {
  return (
    <DocArticle>
      <h1>Styling</h1>
      <p>
        Swift Rust doesn't lock you into a styling solution. It ships with optional Tailwind CSS
        support and works with any styling approach that works in React.
      </p>

      <h2>Tailwind CSS</h2>
      <p>
        Choose Tailwind when you scaffold and the framework will set everything up for you. The
        scaffolder uses Tailwind v4's <code>@tailwindcss/postcss</code> plugin and the new CSS-first
        configuration.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>app/globals.css</span>
        </div>
        <pre>
          <code>{`@import "tailwindcss";

@theme {
  --color-bg: #ffffff;
  --color-fg: #0c0a09;
  --color-accent: #ea580c;
  --font-sans: var(--font-geist-sans), system-ui, sans-serif;
}

body {
  background: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-sans);
}`}</code>
        </pre>
      </div>

      <h2>CSS Modules</h2>
      <p>
        Name your file with the <code>.module.css</code> suffix to use CSS Modules. Classes are
        scoped automatically.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>Button.module.css</span>
        </div>
        <pre>
          <code>{`.button {
  background: var(--color-accent);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}`}</code>
        </pre>
      </div>

      <h2>shadcn-style components</h2>
      <p>
        Add accessible, theme-able components with one CLI command. The components are copied into
        your project — you own the code, and you can edit it freely.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>terminal</span>
        </div>
        <pre>
          <code>{`# Add a few components
bunx swift-rust add button card input

# Or add them all at once
bunx swift-rust add --all`}</code>
        </pre>
      </div>

      <h2>Design tokens</h2>
      <p>
        The shadcn-style components in <code>@swift-rust/ui</code> use CSS variables you can
        override in your
        <code>globals.css</code>:
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>app/globals.css</span>
        </div>
        <pre>
          <code>{`:root {
  --ui-bg: #ffffff;
  --ui-fg: #0c0a09;
  --ui-accent: #ea580c;
  --ui-border: #e7e5e4;
}`}</code>
        </pre>
      </div>

      <h2>Next steps</h2>
      <p>
        Continue to <a href="/docs/getting-started/fonts">Fonts</a>.
      </p>
    </DocArticle>
  );
}
