import { DocArticle } from "@/app/components/doc-article";
export const metadata = { title: "Single binary deploy" };

export default function SingleBinaryPage() {
  return (
    <DocArticle>
      <h1>Single binary deploy</h1>
      <p>
        Swift Rust compiles your app into a single statically-linked binary. The output is portable
        across Linux distributions — no glibc version compatibility issues, no Node.js, no npm at
        runtime.
      </p>

      <h2>Build</h2>
      <div className="code-block">
        <div className="code-block-header">
          <span>terminal</span>
        </div>
        <pre>
          <code>{`cargo build --release
# → target/release/swift-rust-app
# A single 12-20MB binary, no runtime dependencies`}</code>
        </pre>
      </div>

      <h2>Run</h2>
      <div className="code-block">
        <div className="code-block-header">
          <span>terminal</span>
        </div>
        <pre>
          <code>{"PORT=3000 ./target/release/swift-rust-app"}</code>
        </pre>
      </div>

      <h2>What gets bundled</h2>
      <ul>
        <li>The Swift Rust runtime (the framework's core, powered with Rust)</li>
        <li>Your application code (compiled to WASM)</li>
        <li>The Bun runtime (statically linked)</li>
        <li>All your static assets (images, fonts, CSS, JS)</li>
        <li>Your PDF templates and font files</li>
      </ul>

      <h2>Cross-compilation</h2>
      <p>
        The build system supports cross-compilation to any target that Rust supports. Add the target
        with <code>rustup target add</code> and pass <code>--target</code> to{" "}
        <code>cargo build</code>.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>terminal</span>
        </div>
        <pre>
          <code>{`# Build for aarch64 Linux from an x86_64 host
rustup target add aarch64-unknown-linux-musl
cargo build --release --target aarch64-unknown-linux-musl`}</code>
        </pre>
      </div>

      <h2>Deployment targets</h2>
      <p>The single binary deploys to any environment that can run Linux ELF binaries:</p>
      <ul>
        <li>AWS EC2, GCP Compute Engine, Azure VMs</li>
        <li>DigitalOcean, Linode, Vultr, Hetzner</li>
        <li>Fly.io, Render, Railway</li>
        <li>Kubernetes, Docker Swarm, Nomad</li>
        <li>Bare metal</li>
      </ul>

      <h2>Systemd unit</h2>
      <div className="code-block">
        <div className="code-block-header">
          <span>/etc/systemd/system/swift-rust-app.service</span>
        </div>
        <pre>
          <code>{`[Unit]
Description=Swift Rust App
After=network.target

[Service]
Type=simple
User=app
WorkingDirectory=/opt/swift-rust-app
ExecStart=/opt/swift-rust-app/swift-rust-app
Restart=on-failure
Environment=PORT=3000

[Install]
WantedBy=multi-user.target`}</code>
        </pre>
      </div>
    </DocArticle>
  );
}
