export default function DashboardLoading() {
  return (
    <div className="px-6 py-10 sm:px-10">
      <div className="h-4 w-16 animate-pulse rounded bg-[var(--color-surface-2)]" />
      <div className="mt-2 h-9 w-72 animate-pulse rounded bg-[var(--color-surface-2)]" />
      <div className="mt-2 h-4 w-96 animate-pulse rounded bg-[var(--color-surface-2)]" />
      <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-[var(--color-surface)] p-6">
            <div className="h-3 w-20 animate-pulse rounded bg-[var(--color-surface-2)]" />
            <div className="mt-3 h-8 w-24 animate-pulse rounded bg-[var(--color-surface-2)]" />
            <div className="mt-3 h-3 w-32 animate-pulse rounded bg-[var(--color-surface-2)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
