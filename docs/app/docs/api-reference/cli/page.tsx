import { DocArticle } from "@/app/components/doc-article";
export const metadata = { title: "CLI" };

export default function CliRefPage() {
  return (
    <DocArticle>
      <h1>CLI</h1>
      <p>
        The Swift Rust CLI is a single <code>swift-rust</code> binary that does everything: dev
        server, build, scaffold, and add components.
      </p>

      <h2>
        <code>swift-rust dev</code>
      </h2>
      <p>Start the dev server with hot module replacement, error overlay, and request timing.</p>
      <div className="code-block">
        <div className="code-block-header">
          <span>terminal</span>
        </div>
        <pre>
          <code>{`bunx swift-rust dev
bunx swift-rust dev --port 4000
bunx swift-rust dev --open`}</code>
        </pre>
      </div>

      <h2>
        <code>swift-rust build</code>
      </h2>
      <p>Build for production. Produces a single binary.</p>
      <div className="code-block">
        <div className="code-block-header">
          <span>terminal</span>
        </div>
        <pre>
          <code>{`bunx swift-rust build
bunx swift-rust build --target aarch64-unknown-linux-musl`}</code>
        </pre>
      </div>

      <h2>
        <code>swift-rust start</code>
      </h2>
      <p>Start the production server from a built binary.</p>
      <div className="code-block">
        <div className="code-block-header">
          <span>terminal</span>
        </div>
        <pre>
          <code>{"bunx swift-rust start --port 3000"}</code>
        </pre>
      </div>

      <h2>
        <code>swift-rust add</code>
      </h2>
      <p>Add shadcn-style UI components to your project.</p>
      <div className="code-block">
        <div className="code-block-header">
          <span>terminal</span>
        </div>
        <pre>
          <code>{`bunx swift-rust add button card input
bunx swift-rust add --all
bunx swift-rust add dialog --dir src/components/ui --overwrite`}</code>
        </pre>
      </div>

      <h2>
        <code>swift-rust init</code>
      </h2>
      <p>Initialize the UI registry in an existing project.</p>
      <div className="code-block">
        <div className="code-block-header">
          <span>terminal</span>
        </div>
        <pre>
          <code>{`bunx swift-rust init
bunx swift-rust init --dir src/lib`}</code>
        </pre>
      </div>

      <h2>
        <code>swift-rust list</code>
      </h2>
      <p>List all 35 available UI components.</p>
    </DocArticle>
  );
}
