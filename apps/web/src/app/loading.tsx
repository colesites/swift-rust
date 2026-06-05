export default function GlobalLoading() {
  return (
    <div className="container-page py-20">
      <div className="mx-auto max-w-md space-y-4">
        <div className="h-3 w-24 animate-pulse rounded bg-surface-2" />
        <div className="h-9 w-72 animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-96 animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-80 animate-pulse rounded bg-surface-2" />
        <div className="mt-8 h-40 w-full animate-pulse rounded-2xl bg-surface-2" />
      </div>
    </div>
  );
}
