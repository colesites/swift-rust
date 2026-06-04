import { DocArticle } from "@/app/components/doc-article";
export const metadata = { title: "Installation" };

export default function InstallationPage() {
  return (
    <DocArticle>
      <h1>Installation</h1>
      <p>Create a new swift-rust project and run it locally.</p>

      <h2>Quick Start</h2>
      <ol>
        <li>
          Create a new swift-rust project named <code>my-app</code>.
        </li>
        <li>
          <code>cd my-app</code> and start the dev server.
        </li>
        <li>
          Visit <code>http://localhost:3210</code>.
        </li>
      </ol>
      <div className="code-block">
        <div className="code-block-header">
          <span>Terminal</span>
        </div>
        <pre>
          <code>{`bun create swift-rust@latest my-app --yes
cd my-app
bun dev`}</code>
        </pre>
      </div>
      <p>
        <code>--yes</code> skips prompts using saved preferences or defaults. The default setup
        enables TypeScript, Tailwind CSS, ESLint, App Router, and <code>src</code>, with import
        alias <code>@/*</code>, and includes <code>AGENTS.md</code> (with a <code>CLAUDE.md</code>{" "}
        that references it) to guide coding agents to write up-to-date swift-rust code.
      </p>

      <h2>System Requirements</h2>
      <p>
        Before you begin, make sure your development environment meets the following requirements:
      </p>
      <ul>
        <li>
          <strong>Bun</strong> 1.3.0+ (no Node.js)
        </li>
        <li>
          <strong>Rust</strong> 1.85+ (only required for native builds)
        </li>
        <li>
          <strong>Linux, macOS, or Windows</strong>
        </li>
      </ul>

      <h2>Supported Browsers</h2>
      <p>swift-rust supports modern browsers with zero configuration.</p>
      <ul>
        <li>Chrome 111+</li>
        <li>Edge 111+</li>
        <li>Firefox 111+</li>
        <li>Safari 16.4+</li>
        <li>Zen</li>
      </ul>

      <h2>Scaffold a new project</h2>
      <p>
        The fastest way to start is with the <code>create-swift-rust</code> scaffolder. It asks a
        few questions (or accepts flags for a non-interactive run) and creates a new project in the
        current directory.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>Terminal</span>
        </div>
        <pre>
          <code>{`bun create swift-rust@latest my-app
cd my-app
bun run dev`}</code>
        </pre>
      </div>
      <p>On installation, you'll see the following prompts:</p>
      <div className="code-block">
        <div className="code-block-header">
          <span>Terminal</span>
        </div>
        <pre>
          <code>{`What is your project named? my-app
Would you like to use the recommended swift-rust defaults?
  Yes, use recommended defaults - TypeScript, ESLint, Tailwind CSS, App Router, AGENTS.md
  No, reuse previous settings
  No, customize settings - Choose your own preferences`}</code>
        </pre>
      </div>
      <p>
        If you choose to <code>customize settings</code>, you'll see the following prompts:
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>Terminal</span>
        </div>
        <pre>
          <code>{`Would you like to use TypeScript? No / Yes
Which linter would you like to use? ESLint / Biome / None
Would you like to use React Compiler? No / Yes
Would you like to use Tailwind CSS? No / Yes
Would you like your code inside a \`src/\` directory? No / Yes
Would you like to use App Router? (recommended) No / Yes
Would you like to customize the import alias (\`@/*\` by default)? No / Yes
What import alias would you like configured? @/*
Would you like to include AGENTS.md to guide coding agents to write up-to-date swift-rust code? No / Yes`}</code>
        </pre>
      </div>
      <p>
        After the prompts, <code>create-swift-rust</code> will create a folder with your project
        name and install the required dependencies.
      </p>

      <h2>Non-interactive mode</h2>
      <p>
        Every prompt can be replaced with a flag. Useful for CI, scripts, or when you know exactly
        what you want.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>Terminal</span>
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
    </DocArticle>
  );
}
