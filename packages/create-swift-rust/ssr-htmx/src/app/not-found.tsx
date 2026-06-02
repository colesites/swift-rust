export const metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-fg-secondary">Page not found</p>
        <a href="/" className="text-accent mt-6 inline-block">
          ← Go home
        </a>
      </div>
    </main>
  );
}
