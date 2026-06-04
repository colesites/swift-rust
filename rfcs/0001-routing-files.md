# RFC 0001 — Swift‑Rust Routing Files

> Status: **Implemented (server pipeline)** · Target: `swift-rust` router core · Author: Framework Architecture
>
> This RFC specifies a complete set of new file‑based routing primitives for
> Swift‑Rust. The server‑side pipeline is **implemented and tested**:
> `schema`, `guard`, `loader`, `action`, `config`, `proxy`, `revalidate`,
> `error-recovery`, `seo`, `state`, `rpc`, `stream`, `edge`, `worker`,
> `variant`, `i18n`, `query`. Still pending (need the parallel‑routes and
> client‑navigator subsystems): `shell`, `fragment`, `fallback`,
> `transition`, `pending`, `prefetch`. The goal is a routing system more
> powerful and more ergonomic than the Next.js App Router while staying
> RSC‑native, streaming‑first, type‑safe, and portable across Node, Edge,
> Workers, and a future Rust backend.
>
> Note: the request‑interception file is **`proxy.ts`** (Next.js naming);
> `middleware.ts` is accepted with a deprecation warning. Routing files live
> under the app root (`app/src/` when a `src/` directory is used); misplaced
> files are flagged at startup.

---

## 0. Table of contents

1. Routing lifecycle (execution order)
2. Core type definitions
3. File specifications
   - 3.1 Core (priority): `guard` · `loader` · `action` · `pending` · `revalidate` · `config`
   - 3.2 Specialized: `shell` · `fragment` · `transition` · `schema` · `proxy` · `fallback` · `prefetch` · `error-recovery` · `i18n`
   - 3.3 Advanced: `rpc` · `stream` · `edge` · `worker` · `query` · `state` · `seo` · `variant`
4. Example project structure
5. Router core: discovery & execution
6. Vercel Build Output API adapter
7. Recommended starter set & rollout plan

---

## 1. Routing lifecycle (execution order)

A request to a matched route flows through a fixed pipeline. Every file is
**optional**; the router skips absent ones. Files compose **outermost‑first**
for layout‑like concerns and **innermost‑last** for leaf concerns, mirroring
the segment nesting `app → app/(group) → app/dashboard → app/dashboard/[id]`.

```
                          ┌─────────────────────────────── REQUEST ───────────────────────────────┐
                          │                                                                        │
  edge.ts / worker.ts ──▶ runtime selection (where this segment executes)                          │
          │                                                                                         │
          ▼                                                                                         │
  ┌───────────────┐   per segment, outer → inner                                                    │
  │ proxy.ts │ ─▶ rewrites / headers / short‑circuit (cheap, no data)                          │
  └───────────────┘                                                                                 │
          │                                                                                         │
          ▼                                                                                         │
  ┌──────────┐   schema.ts + query.ts validate params / searchParams (typed, may 400)               │
  │  schema  │                                                                                       │
  └──────────┘                                                                                       │
          │                                                                                         │
          ▼                                                                                         │
  ┌──────────┐   guard.ts (auth / roles / flags) — outer → inner, may redirect / 401 / 403           │
  │  guard   │                                                                                       │
  └──────────┘                                                                                       │
          │                                                                                         │
          ├──────────────── if method mutates (POST/PUT/PATCH/DELETE) ─────────────┐                │
          ▼                                                                          ▼                │
  ┌──────────┐   loader.ts (parallel across segments)            ┌──────────┐  action.ts (the one    │
  │  loader  │ ─▶ data for layout/page (RSC, streamable)         │  action  │  matching the submit)  │
  └──────────┘                                                    └──────────┘  → revalidate + render │
          │                                                            │                              │
          ▼                                                            ▼                              │
  ┌──────────────────────────────────────────────────────────────────────────────┐                 │
  │ RENDER (RSC tree):  shell → layout(s) → template → (Suspense: loading/pending) │                 │
  │                      → page  ·  parallel @slots → fallback                      │                 │
  │                      transition.tsx wraps client navigation                     │                 │
  └──────────────────────────────────────────────────────────────────────────────┘                 │
          │                                                                                         │
          ├─ error thrown ─▶ error.tsx → error-recovery.tsx → not-found.tsx → global-error.tsx       │
          │                                                                                         │
          ▼                                                                                         │
  stream.ts (custom streaming) · seo.tsx (head/JSON‑LD) · state.ts (hydration payload)               │
          │                                                                                         │
          ▼                                                                                         │
  revalidate.ts (decide cache TTL / tags) · config.ts (caching, headers, runtime — read up‑front)    │
          │                                                                                         │
          └──────────────────────────────────── RESPONSE ────────────────────────────────────────┘
```

### Canonical phase order

| # | Phase | Files | Runs on | Can short‑circuit? |
|---|-------|-------|---------|--------------------|
| 0 | **Runtime resolution** | `config.ts`, `edge.ts`, `worker.ts` | build/boot | — |
| 1 | **Middleware** | `proxy.ts` | server (edge or node) | ✅ rewrite/redirect/response |
| 2 | **Input validation** | `schema.ts`, `query.ts` | server | ✅ 400 |
| 3 | **Guards** | `guard.ts` | server | ✅ redirect / 401 / 403 |
| 4a | **Mutation** (non‑GET) | `action.ts` | server | ✅ redirect / error |
| 4b | **Data load** (GET) | `loader.ts`, `state.ts` | server (RSC) | ✅ redirect / notFound |
| 5 | **Render** | `shell`, `layout`, `template`, `page`, `loading`, `pending`, `fragment`, `fallback`, `default`, `transition`, `seo`, `variant` | server (RSC) + client islands | — |
| 6 | **Streaming** | `stream.ts` | server | — |
| 7 | **Error path** | `error`, `error-recovery`, `not-found`, `global-error` | server + client | — |
| 8 | **Caching** | `revalidate.ts`, `prefetch.ts` | server / build / client | — |
| – | **Cross‑cutting** | `i18n.ts`, `rpc.ts` | server | — |

Key rules:

- **Guards run before loaders.** A guard that redirects must abort loaders for
  that segment and its descendants (no wasted work).
- **Loaders run in parallel** across sibling/ancestor segments, then their data
  is joined into a typed, per‑segment `data` map.
- **Actions are exclusive**: exactly one `action.ts` handler runs per mutating
  request; on success it triggers `revalidate.ts` and re‑renders the page.
- **`config.ts` is read first** (at build/boot) because it determines runtime,
  caching, and whether a segment is static, dynamic, or streamed.

---

## 2. Core type definitions

These shared types are imported by every routing file from `swift-rust/router`.
They use branded types and generics for end‑to‑end inference.

```ts
// swift-rust/router — shared route types

/** Brand helper for nominal typing. */
declare const __brand: unique symbol;
export type Brand<T, B> = T & { readonly [__brand]: B };

/** A validated, branded route param value. */
export type Param<Name extends string> = Brand<string, `param:${Name}`>;

/** Where a segment executes. */
export type Runtime = "node" | "edge" | "worker";

/** Standard typed request wrapper passed to server‑side route files. */
export interface RouteRequest<
  TParams extends Record<string, string> = Record<string, string>,
  TSearch extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly url: URL;
  readonly method: string;
  readonly headers: Headers;
  readonly cookies: CookieJar;
  /** Validated route params (after `schema.ts`/`query.ts`). */
  readonly params: TParams;
  /** Validated search params. */
  readonly searchParams: TSearch;
  readonly runtime: Runtime;
  /** Per‑request, mutable bag for passing values between phases. */
  readonly locals: RouteLocals;
  readonly signal: AbortSignal;
  /** Geo/IP/edge metadata when available. */
  readonly geo?: GeoInfo;
}

/** Mutable per‑request context shared across guard → loader → action → render. */
export interface RouteLocals {
  get<K extends keyof RouteLocalsMap>(key: K): RouteLocalsMap[K] | undefined;
  set<K extends keyof RouteLocalsMap>(key: K, value: RouteLocalsMap[K]): void;
}
/** App augments this via declaration merging for typed locals. */
export interface RouteLocalsMap {}

export interface CookieJar {
  get(name: string): string | undefined;
  set(name: string, value: string, opts?: CookieOptions): void;
  delete(name: string, opts?: Pick<CookieOptions, "path" | "domain">): void;
  all(): ReadonlyMap<string, string>;
}

export interface GeoInfo {
  country?: string; region?: string; city?: string; latitude?: number; longitude?: number; ip?: string;
}

/** Control‑flow results any server route file may return/throw. */
export type RouteControl =
  | { kind: "next" }                                   // continue pipeline
  | { kind: "redirect"; to: string; status?: 307 | 308 | 302 | 301 }
  | { kind: "rewrite"; to: string }
  | { kind: "response"; response: Response }            // short‑circuit
  | { kind: "notFound" }
  | { kind: "error"; error: unknown; status?: number };

/** Sugar helpers (also exported as functions). */
export declare function redirect(to: string, status?: 307 | 308 | 302 | 301): never;
export declare function rewrite(to: string): never;
export declare function notFound(): never;
export declare function forbidden(): never;   // 403
export declare function unauthorized(): never; // 401

/** Inference helpers used by `page.tsx` to read upstream data. */
export type LoaderData<L> = L extends (...a: any[]) => infer R
  ? Awaited<R> extends Response ? never : Awaited<R>
  : never;
export type ActionData<A> = A extends (...a: any[]) => infer R ? Awaited<R> : never;
export type InferParams<S> = S extends { params: infer P } ? P : Record<string, string>;
export type InferSearch<S> = S extends { searchParams: infer Q } ? Q : Record<string, unknown>;
```

Design notes:

- **`RouteRequest` is the single object** threaded through every server file —
  one mental model, fully typed by the segment's `schema.ts`.
- **`locals`** replaces ad‑hoc `(req as any).user`. Apps type it by augmenting
  `RouteLocalsMap`, so `guard.ts` setting `locals.set("user", u)` is visible
  (typed) in `loader.ts` and `page.tsx`.
- **`RouteControl`** is the union every phase speaks; the router interprets it
  uniformly, so redirect/notFound/rewrite behave identically everywhere.

---

## 3. File specifications

Each spec lists: **purpose · when it runs · exports · types · order · interactions · errors/redirects · example · server/client boundary.**

### 3.1 Core files (priority)

---

#### `guard.ts` — route protection

- **Purpose:** authn/authz, roles, permissions, feature flags. The single
  place to deny access before any data work.
- **When:** phase 3, after validation, **before** loaders/actions. Outer → inner.
- **Server only.**

```ts
import type { RouteRequest, RouteControl } from "swift-rust/router";

export interface GuardContext<P, Q> extends RouteRequest<P, Q> {}

export type GuardResult = RouteControl | void; // void === allow (next)

/** Default export: the guard. May be async. */
export default function guard<P, Q>(ctx: GuardContext<P, Q>): GuardResult | Promise<GuardResult>;

/** Optional: declare what this guard provides into locals (typed). */
export const provides: ReadonlyArray<keyof RouteLocalsMap> | undefined;
```

- **Order/interaction:** runs top‑down through nested segments; a parent guard
  failing skips child guards, loaders, and render. Guards may `locals.set(...)`
  to pass an authenticated user to loaders/page.
- **Errors/redirects:** `return redirect("/login")`, `unauthorized()` (401),
  `forbidden()` (403), or throw — routed to the error path.
- **Example:**

```ts
// app/dashboard/guard.ts
import { redirect, unauthorized } from "swift-rust/router";
export default async function guard(ctx) {
  const session = await getSession(ctx.cookies.get("sid"));
  if (!session) return redirect("/login?next=" + ctx.url.pathname);
  if (!session.user.roles.includes("admin")) return unauthorized();
  ctx.locals.set("user", session.user);
}
```

---

#### `loader.ts` — explicit data loader (Remix‑style)

- **Purpose:** fetch the data a segment's `layout`/`page` needs. First‑class,
  cacheable, streamable, and **typed into `page.tsx`**.
- **When:** phase 4b (GET), after guards. Loaders for all matched segments run
  **in parallel**.
- **Server only (RSC).**

```ts
import type { RouteRequest } from "swift-rust/router";

export interface LoaderContext<P, Q> extends RouteRequest<P, Q> {
  /** Parent segments' loader data, already resolved (typed). */
  parent: <T = unknown>() => Promise<T>;
  /** Mark a value as streamed (resolves after first paint). */
  defer: <T>(p: Promise<T>) => Deferred<T>;
}
export type Deferred<T> = Brand<Promise<T>, "deferred">;

export default function loader<P, Q>(ctx: LoaderContext<P, Q>): unknown | Promise<unknown>;

/** Optional caching hints (overridable by revalidate.ts). */
export const cache: { revalidate?: number | false; tags?: string[] } | undefined;
```

- **Interaction:** `page.tsx`/`layout.tsx` read the value via the typed
  `useLoaderData<typeof loader>()` hook or the injected `data` prop. `defer()`
  enables partial streaming with `loading.tsx`/`Suspense`.
- **Errors/redirects:** throw / `notFound()` / `redirect()`.
- **Example:**

```ts
// app/posts/[slug]/loader.ts
import { notFound } from "swift-rust/router";
export default async function loader(ctx) {
  const post = await db.post.find(ctx.params.slug);
  if (!post) notFound();
  const related = ctx.defer(db.post.related(post.id)); // streams in later
  return { post, related };
}
export const cache = { revalidate: 60, tags: ["posts"] };
```

```tsx
// app/posts/[slug]/page.tsx
import { useLoaderData } from "swift-rust/router";
import loader from "./loader";
export default function Page() {
  const { post, related } = useLoaderData<typeof loader>();
  return <Article post={post} related={related} />;
}
```

---

#### `action.ts` — form / mutation handler

- **Purpose:** handle mutations (form posts, RPC‑less writes) co‑located with
  the route. Progressive‑enhancement friendly.
- **When:** phase 4a, on non‑GET requests. Exactly one action runs (the one the
  form targets); afterward the page re‑renders with fresh loader data.
- **Server only.**

```ts
import type { RouteRequest } from "swift-rust/router";

export interface ActionContext<P, Q> extends RouteRequest<P, Q> {
  formData: () => Promise<FormData>;
  json: <T = unknown>() => Promise<T>;
}

export default function action<P, Q>(ctx: ActionContext<P, Q>): unknown | Promise<unknown>;

/** Optional: named actions, dispatched by `_action` field or `?_action=`. */
export const actions: Record<string, (ctx: ActionContext<any, any>) => unknown> | undefined;
```

- **Interaction:** returned value is exposed via `useActionData<typeof action>()`.
  On success the router runs `revalidate.ts` and re‑renders. Validate inputs with
  `schema.ts`.
- **Errors/redirects:** return validation errors (rendered), or `redirect()`
  on success (POST‑redirect‑GET).
- **Example:**

```ts
// app/posts/new/action.ts
import { redirect } from "swift-rust/router";
import { PostSchema } from "./schema";
export default async function action(ctx) {
  const form = await ctx.formData();
  const parsed = PostSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { errors: parsed.error.flatten() };
  const post = await db.post.create(parsed.data);
  return redirect(`/posts/${post.slug}`);
}
```

---

#### `pending.tsx` — pending navigation UI

- **Purpose:** UI shown **during client navigation** to this segment (distinct
  from `loading.tsx`, which is the Suspense fallback during the *initial*
  server stream). Think: top‑bar progress, skeletal optimistic state.
- **When:** phase 5, client‑side, while the next route's data is in flight.
- **Client component.**

```tsx
export interface PendingProps {
  /** Target the user is navigating to. */
  href: string;
  /** Milliseconds the navigation has been pending. */
  elapsed: number;
  /** Cancel the in‑flight navigation. */
  cancel: () => void;
}
export default function Pending(props: PendingProps): JSX.Element;
/** Delay before showing (avoids flash on fast nav). Default 120ms. */
export const delay: number | undefined;
```

- **Interaction:** rendered by the router shell around `transition.tsx`. Falls
  back to `loading.tsx` if absent.

---

#### `revalidate.ts` — custom revalidation logic

- **Purpose:** decide, per request/mutation, how long a segment stays fresh and
  which cache tags to bust. Programmatic ISR.
- **When:** phase 8, after render/action.
- **Server / build.**

```ts
import type { RouteRequest } from "swift-rust/router";

export interface RevalidateContext<P, Q> extends RouteRequest<P, Q> {
  /** Data produced by this segment's loader (if any). */
  data: unknown;
  /** True when invoked after a mutation. */
  afterAction: boolean;
}
export interface RevalidatePlan {
  /** Seconds until stale, `false` = never, `0` = always dynamic. */
  ttl?: number | false;
  /** Tags to invalidate now (e.g. after a write). */
  invalidate?: string[];
  /** Re‑render eagerly vs lazily. */
  mode?: "lazy" | "eager";
}
export default function revalidate<P, Q>(ctx: RevalidateContext<P, Q>): RevalidatePlan | Promise<RevalidatePlan>;
```

- **Interaction:** overrides `loader.cache` and `config.ts` caching for this
  request. Pairs with `updateTag(tag)` calls from `action.ts`.

---

#### `config.ts` — route configuration

- **Purpose:** static, build‑time configuration for the segment: runtime,
  caching, rendering strategy, headers, body limits, etc.
- **When:** phase 0 (read at build/boot). Pure data — no request access.
- **Isomorphic data (no side effects).**

```ts
import type { Runtime } from "swift-rust/router";

export interface RouteConfig {
  runtime?: Runtime;                       // node | edge | worker
  rendering?: "static" | "dynamic" | "ssr-stream" | "isr";
  revalidate?: number | false;             // default ISR window
  dynamicParams?: boolean;                 // allow params outside generateStaticParams
  cache?: "force-cache" | "no-store" | "default";
  headers?: Record<string, string>;
  maxDuration?: number;                    // seconds
  bodyLimit?: `${number}${"kb" | "mb"}`;
  preferRegion?: string | string[];        // edge region pinning
  experimental?: Record<string, unknown>;
}
export const config: RouteConfig;          // named export `config`
export default config;                     // or default
```

- **Interaction:** the router merges nested `config.ts` (inner overrides outer)
  and feeds the result to the Vercel adapter (§6).

---

### 3.2 Specialized files

---

#### `shell.tsx` — outer document shell

- **Purpose:** the `<html>`/`<body>`, global providers, and the document
  skeleton that wraps **all** routes. One per app root (optionally per route
  group). Distinct from `layout.tsx` (which renders *inside* the body).
- **When:** phase 5, outermost render wrapper.
- **Server component (may host client providers).**

```tsx
import type { ReactNode } from "react";
export interface ShellProps {
  children: ReactNode;
  /** Collected <head> from seo.tsx / metadata. */
  head: ReactNode;
  locale: string;
  /** Nonce for CSP‑safe inline scripts. */
  nonce?: string;
}
export default function Shell(props: ShellProps): JSX.Element;
```

- **Interaction:** receives `seo.tsx` output as `head`; wraps `layout` tree.
  Replaces the framework's implicit document wrapper when present.

---

#### `fragment.tsx` — reusable route fragment

- **Purpose:** a render unit reusable across **parallel routes (`@slot`)**,
  **intercepting routes** (modals/drawers), and shared partials. Renders without
  owning a URL segment by itself.
- **When:** phase 5, mounted into a named slot or interception target.
- **Server or client.**

```tsx
export interface FragmentProps<TData = unknown> {
  data?: TData;
  slot?: string;                    // which @slot it fills
  intercepted?: boolean;            // true when shown via interception
  dismiss?: () => void;             // for modal/drawer fragments
}
export default function Fragment<TData>(props: FragmentProps<TData>): JSX.Element;
/** Declare which slots/intercepts this fragment can satisfy. */
export const targets: ReadonlyArray<`@${string}` | `(..)${string}`> | undefined;
```

- **Interaction:** the router resolves `@modal`/`(.)photo` interceptions to a
  fragment; `fallback.tsx` covers the un‑intercepted state.

---

#### `transition.tsx` — page transition config/component

- **Purpose:** declarative client navigation transitions (view‑transitions API,
  crossfade, shared‑element). Wraps outgoing/incoming trees.
- **When:** phase 5, client navigation only.
- **Client component.**

```tsx
export interface TransitionProps {
  children: ReactNode;
  phase: "enter" | "exit";
  from: string; to: string;
}
export default function Transition(props: TransitionProps): JSX.Element;
/** Or pure config consumed by the router's navigator. */
export const transition: {
  type?: "view-transition" | "crossfade" | "none";
  duration?: number; easing?: string;
  sharedElements?: string[];
} | undefined;
```

---

#### `schema.ts` — params / searchParams / form schema

- **Purpose:** the **source of truth for typed inputs**. Standard‑Schema
  compatible (Zod, Valibot, ArkType). Drives inference for `RouteRequest`.
- **When:** phase 2, before guards. Validates and brands params/search/forms.
- **Isomorphic (schema definition); validation runs server‑side.**

```ts
import type { StandardSchemaV1 } from "swift-rust/router";

export const params: StandardSchemaV1 | undefined;        // path params
export const searchParams: StandardSchemaV1 | undefined;  // query
export const form: StandardSchemaV1 | undefined;          // action body

/** On validation failure (default: 400 with issues). */
export const onInvalid: ((issues: ReadonlyArray<unknown>) => Response | void) | undefined;
```

- **Interaction:** the router infers `P`/`Q` for **every** file in the segment
  from these schemas — `guard`, `loader`, `action`, `page` all get typed
  `params`/`searchParams` for free.
- **Example:**

```ts
// app/posts/[slug]/schema.ts
import { z } from "zod";
export const params = z.object({ slug: z.string().min(1) });
export const searchParams = z.object({ page: z.coerce.number().default(1) });
```

---

#### `proxy.ts` — per‑route middleware

- **Purpose:** cheap, data‑free request interception scoped to a subtree:
  rewrites, header injection, A/B bucket assignment, redirects.
- **When:** phase 1, before everything. Outer → inner.
- **Server (edge by default).**

```ts
import type { RouteRequest, RouteControl } from "swift-rust/router";
export default function middleware(ctx: RouteRequest): RouteControl | void | Promise<RouteControl | void>;
/** Limit which paths this middleware runs on within the subtree. */
export const matcher: string | string[] | undefined;
```

- **vs `guard.ts`:** middleware is for *routing/transport* concerns (no data,
  edge‑cheap); guards are for *access* decisions (may hit the DB).

---

#### `fallback.tsx` — parallel‑route fallback

- **Purpose:** what a named slot renders when it has **no matching route**
  (un‑filled `@slot`), or while its content loads.
- **When:** phase 5.
- **Server or client.**

```tsx
export interface FallbackProps { slot: `@${string}`; }
export default function Fallback(props: FallbackProps): JSX.Element;
```

- **Interaction:** complements `default.tsx` (which handles unmatched slots on
  hard navigation); `fallback.tsx` is the richer, per‑slot version.

---

#### `prefetch.ts` — prefetch strategy

- **Purpose:** declare how/when links to this segment are prefetched.
- **When:** phase 8, client (on hover/viewport/intent) and build (static hints).
- **Isomorphic config + optional client predicate.**

```ts
export interface PrefetchStrategy {
  on?: "hover" | "viewport" | "intent" | "render" | "none";
  /** Prefetch loader data, the RSC payload, or both. */
  include?: ("data" | "rsc" | "assets")[];
  /** Priority hint. */
  priority?: "high" | "low" | "auto";
}
export const prefetch: PrefetchStrategy;
/** Optional runtime predicate (e.g. skip on slow connections). */
export const shouldPrefetch: ((href: string) => boolean) | undefined;
```

---

#### `error-recovery.tsx` — recovery UI + retry logic

- **Purpose:** a richer error boundary that owns **retry/backoff/reset**
  behavior, sitting between `error.tsx` and a hard failure.
- **When:** phase 7, when a segment throws.
- **Client component.**

```tsx
export interface RecoveryProps {
  error: Error & { digest?: string };
  /** Re‑run loaders + re‑render this segment. */
  retry: (opts?: { backoffMs?: number }) => void;
  /** Reset to a known‑good boundary. */
  reset: () => void;
  attempt: number;
}
export default function ErrorRecovery(props: RecoveryProps): JSX.Element;
/** Auto‑retry policy. */
export const policy: { retries?: number; backoff?: "linear" | "exponential"; baseMs?: number } | undefined;
```

- **Order:** `error.tsx` (catch) → `error-recovery.tsx` (retry) → `not-found` /
  `global-error` (give up).

---

#### `i18n.ts` — route‑specific i18n

- **Purpose:** locale resolution, message namespaces, and locale‑aware routing
  for the subtree.
- **When:** phase 1–2 (locale resolution) and phase 5 (message provider).
- **Server config + isomorphic messages.**

```ts
export interface I18nConfig {
  locales: string[];
  defaultLocale: string;
  strategy?: "prefix" | "domain" | "cookie" | "header";
  /** Namespaces this subtree loads. */
  namespaces?: string[];
  resolve?: (ctx: RouteRequest) => string | Promise<string>;
}
export const i18n: I18nConfig;
export const messages: Record<string /*locale*/, () => Promise<Record<string, unknown>>> | undefined;
```

---

### 3.3 Advanced / experimental files

---

#### `rpc.ts` — typed RPC / tRPC‑style endpoint

- **Purpose:** co‑located, fully‑typed procedures callable from the client
  without hand‑written fetch wrappers.
- **When:** on demand (client calls); server only.

```ts
import type { RouteRequest } from "swift-rust/router";
export interface Procedure<I, O> {
  input?: StandardSchemaV1<I>;
  type: "query" | "mutation";
  handler: (input: I, ctx: RouteRequest) => O | Promise<O>;
}
export const procedures: Record<string, Procedure<any, any>>;
/** Client gets `const api = createClient<typeof procedures>()` with full inference. */
```

- **Example:** `await api.search.query({ q })` → typed `O`, no endpoint strings.

---

#### `stream.ts` — dedicated streaming handler

- **Purpose:** custom streaming responses (SSE, chunked JSON, AI token streams)
  with backpressure control, separate from RSC streaming.
- **When:** phase 6; server.

```ts
import type { RouteRequest } from "swift-rust/router";
export default function stream(ctx: RouteRequest): ReadableStream | Response | AsyncIterable<unknown>;
export const contentType: string | undefined; // e.g. "text/event-stream"
```

---

#### `edge.ts` — force Edge runtime + config

- **Purpose:** opt a segment into the Edge runtime with edge‑specific options.
  Sugar over `config.ts` `runtime: "edge"` plus edge‑only knobs.
- **When:** phase 0.

```ts
export const edge: {
  regions?: string[] | "all";
  /** APIs the segment relies on (validated against edge capabilities). */
  requires?: ("crypto" | "streams" | "kv")[];
};
export default edge;
```

---

#### `worker.ts` — worker‑specific route (Cloudflare/Edge)

- **Purpose:** a route that targets a Workers runtime with bindings (KV, R2,
  Durable Objects, D1).
- **When:** phase 0 (runtime) + request handling.

```ts
export interface WorkerEnv { [binding: string]: unknown; }
export default function worker(req: Request, env: WorkerEnv, ctx: { waitUntil(p: Promise<unknown>): void }): Response | Promise<Response>;
export const bindings: string[] | undefined; // declared bindings for typing
```

---

#### `query.ts` — query param parsing + validation

- **Purpose:** richer `searchParams` handling than `schema.ts`: coercion,
  arrays, defaults, serialization back to URLs.
- **When:** phase 2.

```ts
export interface QuerySpec {
  parse: StandardSchemaV1;
  /** Build a URL search string from a typed object (for links). */
  serialize?: (value: Record<string, unknown>) => string;
  /** Keep unknown keys vs strip. */
  passthrough?: boolean;
}
export const query: QuerySpec;
```

- **Interaction:** if both `schema.searchParams` and `query.ts` exist, `query.ts`
  wins for search params (it is the specialized tool).

---

#### `state.ts` — server‑side state initializer

- **Purpose:** seed client stores (Zustand/Jotai/Redux) with server data so the
  first client render is hydrated without a flash.
- **When:** phase 4b (alongside loaders); server, serialized to client.

```ts
import type { RouteRequest } from "swift-rust/router";
export default function state(ctx: RouteRequest): Record<string, unknown> | Promise<Record<string, unknown>>;
/** Which client store key to hydrate. */
export const store: string | undefined;
```

---

#### `seo.tsx` — structured data / SEO injection

- **Purpose:** structured data (JSON‑LD), canonical/alternate links, OpenGraph,
  and `<head>` content beyond basic metadata.
- **When:** phase 5/6; server, output collected into `shell.tsx`'s `head`.

```tsx
import type { RouteRequest } from "swift-rust/router";
export interface SeoContext<P, Q> extends RouteRequest<P, Q> { data: unknown; }
export default function seo<P, Q>(ctx: SeoContext<P, Q>): {
  title?: string; description?: string;
  canonical?: string; robots?: string;
  openGraph?: Record<string, string>;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  alternates?: { hreflang: string; href: string }[];
};
```

---

#### `variant.tsx` — A/B testing / feature variants

- **Purpose:** render a variant of a segment based on a bucket (experiment, flag,
  cohort). Pairs with `proxy.ts` for bucket assignment.
- **When:** phase 5.

```tsx
import type { RouteRequest } from "swift-rust/router";
export interface VariantContext extends RouteRequest { bucket: string; }
export const variants: Record<string /*bucket*/, () => Promise<{ default: React.ComponentType }>>;
export const assign: ((ctx: VariantContext) => string) | undefined; // default: from middleware bucket
```

---

## 4. Example project structure

```
app/
├── shell.tsx                    # <html>/<body>, providers (whole app)
├── config.ts                    # runtime: "node", default ISR
├── i18n.ts                      # locales: en, fr
├── proxy.ts                # A/B bucket + security headers
├── layout.tsx
├── page.tsx
├── (marketing)/                 # route group (no URL segment)
│   ├── layout.tsx
│   └── pricing/
│       ├── page.tsx
│       ├── seo.tsx              # JSON‑LD Product
│       └── variant.tsx          # pricing experiment
├── dashboard/
│   ├── guard.ts                 # require admin
│   ├── config.ts               # rendering: "ssr-stream"
│   ├── layout.tsx
│   ├── loader.ts                # workspace + user
│   ├── state.ts                 # seed client store
│   ├── @analytics/              # parallel slot
│   │   ├── page.tsx
│   │   └── fallback.tsx
│   ├── error.tsx
│   ├── error-recovery.tsx       # retry with backoff
│   └── posts/
│       ├── schema.ts            # params/search types
│       ├── query.ts             # search coercion
│       ├── loader.ts
│       ├── prefetch.ts          # hover prefetch data+rsc
│       ├── page.tsx
│       ├── new/
│       │   ├── schema.ts        # form schema
│       │   ├── action.ts        # create post
│       │   └── page.tsx
│       └── [slug]/
│           ├── loader.ts
│           ├── revalidate.ts    # tag‑based ISR
│           ├── transition.tsx   # shared‑element to list
│           └── page.tsx
├── api/
│   ├── search/
│   │   └── rpc.ts               # typed procedures
│   └── chat/
│       └── stream.ts            # SSE token stream
└── (edge)/
    └── ping/
        ├── edge.ts              # force edge
        └── route.ts
```

---

## 5. Router core: discovery & execution

**Discovery.** At build (and dev), the router walks `app/`, and for each segment
builds a `SegmentManifest`:

```ts
interface SegmentManifest {
  pattern: string;                 // /dashboard/posts/[slug]
  files: Partial<Record<RouteFileKind, string>>; // kind → absolute path
  runtime: Runtime;                // resolved from config/edge/worker
  parallel: Record<`@${string}`, SegmentManifest>;
  intercepts: Record<string, string>;
  isDynamic: boolean;
}
type RouteFileKind =
  | "shell" | "config" | "middleware" | "guard" | "schema" | "query"
  | "loader" | "action" | "state" | "layout" | "template" | "page"
  | "loading" | "pending" | "error" | "error-recovery" | "not-found"
  | "global-error" | "default" | "fallback" | "fragment" | "transition"
  | "revalidate" | "prefetch" | "i18n" | "rpc" | "stream" | "edge"
  | "worker" | "query" | "seo" | "variant" | "route";
```

**Execution.** A single orchestrator — `RouteHandler` — drives the pipeline:

```ts
interface RouteHandler {
  match(url: URL, method: string): MatchResult | null;
  run(match: MatchResult, req: Request): Promise<Response>;
}
```

`run` executes phases §1 in order, threading one `RouteRequest`:

1. Resolve runtime (`config`/`edge`/`worker`) → dispatch to the right executor.
2. Run `proxy` chain (outer→inner); honor `RouteControl`.
3. Validate via `schema`/`query`; brand `params`/`searchParams`.
4. Run `guard` chain (outer→inner); set `locals`.
5. If mutating → run the matched `action`; else run `loader`s in parallel +
   `state`.
6. Build the RSC tree (`shell`→`layout`s→`template`→`page` + `@slots`/`fragment`
   + `loading`/`pending`/`fallback`), apply `variant`, collect `seo` into head.
7. Stream the response (RSC flight or `stream.ts`); on throw, walk the error
   chain (`error`→`error-recovery`→`not-found`→`global-error`).
8. Apply `revalidate`/`config` caching; emit cache tags & headers.

**Type inference.** A segment's `schema.ts` is the inference root: the build
emits a `.swift-rust/types/routes.d.ts` mapping each segment to typed
`params`/`searchParams`/`loaderData`/`actionData`, so `useLoaderData`,
`useActionData`, `<Link href>`, and `RouteRequest` are all checked.

**Modularity for the Rust backend.** Phases 0–4 (runtime, middleware, validation,
guards, loaders, actions) are pure request→`RouteControl` functions with no
React dependency. They are defined as a serializable pipeline so a future Rust
executor can run discovery + phases 0–4 natively and hand only phase 5 (render)
to the JS RSC renderer.

---

## 6. Vercel Build Output API adapter

Each segment's resolved `config`/`edge`/`worker` maps to `.vercel/output`:

| Swift‑Rust | Vercel BOA artifact |
|---|---|
| `config.rendering: "static"` | prerendered HTML in `static/` + `overrides` |
| `config.rendering: "isr"` / `revalidate.ts` | `functions/<seg>.func` + `.prerender-config.json` (`expiration`, `bypassToken`) |
| `config.rendering: "dynamic"` / `"ssr-stream"` | `functions/<seg>.func` (Node) with streaming |
| `runtime: "edge"` / `edge.ts` | `functions/<seg>.func` with `"runtime": "edge"`, `regions` |
| `runtime: "worker"` / `worker.ts` | Edge function + declared bindings (or external Workers deploy) |
| `proxy.ts` (root) | `functions/_middleware.func` (`"runtime":"edge"`) + `config.json` routing |
| `revalidate.invalidate` / cache tags | `x-vercel-cache-tags` headers + on‑demand `revalidateTag` |
| `headers` from `config.ts` | route `headers` in `config.json` |
| `i18n.ts` | `config.json` `i18n` + locale `routes` |
| `rpc.ts` / `stream.ts` / `route.ts` | one `functions/*.func` per handler |

The adapter merges nested `config.ts` (inner wins), groups segments by runtime,
and writes one BOA `config.json` with the route table, plus per‑function
`.vc-config.json`. Cache tags from `revalidate.ts`/`loader.cache` become
`x-vercel-cache-tags` so on‑demand invalidation works.

---

## 7. Recommended starter set & rollout plan

Order chosen for **maximum DX leverage per unit of core work**, and so each
wave is independently shippable.

**Wave 1 — Data & protection (the spine).** `schema.ts` → `guard.ts` →
`loader.ts` → `action.ts` → `config.ts`. These deliver typed inputs, access
control, first‑class data loading, mutations, and per‑route config — the 80%.
Ship `useLoaderData`/`useActionData` + the inferred `routes.d.ts` here.

**Wave 2 — UX & caching.** `pending.tsx` → `revalidate.ts` → `prefetch.ts` →
`error-recovery.tsx` → `transition.tsx`. Polishes navigation, ISR, and error
resilience.

**Wave 3 — Composition.** `shell.tsx` → `fragment.tsx` → `fallback.tsx` →
`proxy.ts` → `seo.tsx`. Unlocks parallel/intercepting routes, custom
documents, and SEO.

**Wave 4 — Platform & advanced.** `i18n.ts` → `query.ts` → `state.ts` →
`stream.ts` → `rpc.ts` → `edge.ts` → `worker.ts` → `variant.ts`. Runtime
targeting, RPC, streaming, experiments.

**Guiding principles.**
- Every file is **optional** and **additive** — no existing route breaks.
- One `RouteRequest`, one `RouteControl` union — uniform mental model.
- `schema.ts` is the inference root; types flow everywhere for free.
- Phases 0–4 stay React‑free and serializable for the future Rust executor.
- Prefer **co‑location** (`loader`/`action`/`schema` next to `page`) over central
  config — the Next.js pain point this design fixes.
