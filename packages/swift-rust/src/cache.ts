// Data cache + on-demand revalidation.
//
// A single process-wide store (kept on globalThis so the app's `swift-rust`
// import and the dev server share ONE instance regardless of how the module was
// resolved). Entries carry an expiry (TTL) and tags; `revalidateTag` /
// `revalidatePath` purge by tag or key substring.
//
// In dev and within a warm production function instance this is a real cache.
// Across instances/CDN, invalidation also relies on the `x-vercel-cache-tags`
// response header (emitted by the render pipeline) + the platform's tag purge;
// `revalidateTag` records the purge so an on-demand endpoint/webhook can act on
// it. The in-memory store is the fast path; the CDN tags are the durable path.

export interface CacheEntry<T = unknown> {
  value: T;
  /** epoch ms when the entry goes stale; 0 = never expires (until invalidated). */
  expires: number;
  tags: string[];
}

interface CacheGlobal {
  store: Map<string, CacheEntry>;
  /** Tags purged since boot — lets an on-demand endpoint report/ack them. */
  purged: Set<string>;
}

const g = globalThis as unknown as { __SR_CACHE__?: CacheGlobal };
const cacheState: CacheGlobal = (g.__SR_CACHE__ ??= { store: new Map(), purged: new Set() });

export interface CacheOptions {
  /** Tags for targeted invalidation via revalidateTag(). */
  tags?: string[];
  /** Seconds before the entry is considered stale. Omit/0 = cache until invalidated. */
  revalidate?: number;
  /** Custom key derivation from the call arguments (defaults to fn name + JSON args). */
  // biome-ignore lint/suspicious/noExplicitAny: key derives from arbitrary call args
  key?: (...args: any[]) => string;
}

/**
 * Wrap an async function so its result is cached by argument key, with optional
 * TTL and tags. Returns a function with the same signature.
 *
 *   const getPosts = cache(fetchPosts, { tags: ["posts"], revalidate: 3600 });
 *   await getPosts();              // miss → runs fetchPosts, caches
 *   await getPosts();              // hit
 *   revalidateTag("posts");        // purge
 */
export function cache<A extends unknown[], R>(
  fn: (...args: A) => Promise<R> | R,
  options: CacheOptions = {},
): (...args: A) => Promise<R> {
  const tags = options.tags ?? [];
  const ttlMs = options.revalidate ? options.revalidate * 1000 : 0;
  const name = fn.name || "anon";
  return async (...args: A): Promise<R> => {
    const key = options.key ? `${name}:${options.key(...args)}` : `${name}:${safeStringify(args)}`;
    const hit = cacheState.store.get(key) as CacheEntry<R> | undefined;
    if (hit && (hit.expires === 0 || hit.expires > Date.now())) return hit.value;
    const value = await fn(...args);
    cacheState.store.set(key, { value, expires: ttlMs ? Date.now() + ttlMs : 0, tags });
    return value;
  };
}

/** Invalidate every cached entry tagged with `tag`. */
export function revalidateTag(tag: string): void {
  for (const [k, v] of cacheState.store) {
    if (v.tags.includes(tag)) cacheState.store.delete(k);
  }
  cacheState.purged.add(`tag:${tag}`);
}

/**
 * Invalidate cached entries whose key references `path`. (Best-effort by
 * substring — useful for "everything derived from /blog/*".) Also records the
 * path so the CDN/platform can purge the rendered route.
 */
export function revalidatePath(path: string): void {
  for (const [k] of cacheState.store) {
    if (k.includes(path)) cacheState.store.delete(k);
  }
  cacheState.purged.add(`path:${path}`);
}

/** Drain the set of purge signals recorded since the last call (for endpoints/webhooks). */
export function drainPurged(): string[] {
  const out = [...cacheState.purged];
  cacheState.purged.clear();
  return out;
}

/** Clear the entire data cache (mainly for tests / dev HMR). */
export function clearCache(): void {
  cacheState.store.clear();
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
