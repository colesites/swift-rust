export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <div className="inline-block mb-4 px-3 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent">
          Welcome
        </div>
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">ssr-htmx</h1>
        <p className="text-lg text-fg-secondary mb-8">
          Get started by editing <code>src/app/page.tsx</code>.
        </p>
        <a
          href="https://swift-rust.dev/docs"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-fg text-bg font-medium text-sm hover:opacity-90 transition-opacity"
        >
          Read the docs →
        </a>
      </div>
    </main>
  );
}
