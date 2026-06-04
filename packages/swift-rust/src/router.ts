import type { ReactNode } from "react";

export interface LayoutProps {
  children: ReactNode;
}

export interface PageProps<P = Record<string, string>> {
  params: P;
  searchParams: Record<string, string | string[]>;
}

export interface RouteHandlerContext<P = Record<string, string>> {
  params: P;
  searchParams: Record<string, string | string[]>;
  request: Request;
  query: Record<string, string>;
  body: unknown;
}

export type RouteHandler<P = Record<string, string>> = (
  context: RouteHandlerContext<P>,
) => Response | Promise<Response>;

export class NotFoundError extends Error {
  readonly digest = "NOT_FOUND";
  constructor(message = "Not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export function notFound(message?: string): never {
  throw new NotFoundError(message);
}

export class RedirectError extends Error {
  readonly digest: string;
  readonly status: number;
  readonly location: string;
  constructor(location: string, status = 307) {
    super(`Redirect to ${location}`);
    this.name = "RedirectError";
    this.digest = `REDIRECT;${status};${location}`;
    this.status = status;
    this.location = location;
  }
}

export function redirect(location: string, status: 307 | 308 | 302 | 303 = 307): never {
  throw new RedirectError(location, status);
}

export function permanentRedirect(location: string): never {
  throw new RedirectError(location, 308);
}

// ── Access-control control flow (used by guard.ts / loader.ts / action.ts) ──

export class UnauthorizedError extends Error {
  readonly digest = "UNAUTHORIZED";
  readonly status = 401;
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}
export class ForbiddenError extends Error {
  readonly digest = "FORBIDDEN";
  readonly status = 403;
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}
export class RewriteError extends Error {
  readonly digest: string;
  readonly to: string;
  constructor(to: string) {
    super(`Rewrite to ${to}`);
    this.name = "RewriteError";
    this.to = to;
    this.digest = `REWRITE;${to}`;
  }
}
export function unauthorized(message?: string): never {
  throw new UnauthorizedError(message);
}
export function forbidden(message?: string): never {
  throw new ForbiddenError(message);
}
export function rewrite(to: string): never {
  throw new RewriteError(to);
}

// ── Core route types (shared by all routing files) ──────────────────────────

export type Runtime = "node" | "edge" | "worker";

export interface CookieOptions {
  path?: string;
  domain?: string;
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}
export interface CookieJar {
  get(name: string): string | undefined;
  set(name: string, value: string, opts?: CookieOptions): void;
  delete(name: string, opts?: Pick<CookieOptions, "path" | "domain">): void;
  all(): ReadonlyMap<string, string>;
}

/** App augments this via declaration merging for typed `locals`. */
export interface RouteLocalsMap {}
export interface RouteLocals {
  get<K extends keyof RouteLocalsMap>(key: K): RouteLocalsMap[K] | undefined;
  set<K extends keyof RouteLocalsMap>(key: K, value: RouteLocalsMap[K]): void;
}

export interface RouteRequest<
  TParams extends Record<string, string> = Record<string, string>,
  TSearch extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly url: URL;
  readonly method: string;
  readonly headers: Headers;
  readonly cookies: CookieJar;
  readonly params: TParams;
  readonly searchParams: TSearch;
  readonly runtime: Runtime;
  readonly locals: RouteLocals;
  readonly request: Request;
}

export type RouteControl =
  | { kind: "next" }
  | { kind: "redirect"; to: string; status?: 301 | 302 | 303 | 307 | 308 }
  | { kind: "rewrite"; to: string }
  | { kind: "response"; response: Response }
  | { kind: "notFound" }
  | { kind: "error"; error: unknown; status?: number };

export type GuardContext<P extends Record<string, string> = Record<string, string>, Q extends Record<string, unknown> = Record<string, unknown>> = RouteRequest<P, Q>;
export type GuardResult = RouteControl | void;

export interface LoaderContext<P extends Record<string, string> = Record<string, string>, Q extends Record<string, unknown> = Record<string, unknown>> extends RouteRequest<P, Q> {
  parent: <T = unknown>() => T | undefined;
}

export interface ActionContext<P extends Record<string, string> = Record<string, string>, Q extends Record<string, unknown> = Record<string, unknown>> extends RouteRequest<P, Q> {
  formData: () => Promise<FormData>;
  json: <T = unknown>() => Promise<T>;
}

export interface RouteConfig {
  runtime?: Runtime;
  rendering?: "static" | "dynamic" | "ssr-stream" | "isr";
  revalidate?: number | false;
  dynamicParams?: boolean;
  cache?: "force-cache" | "no-store" | "default";
  headers?: Record<string, string>;
  maxDuration?: number;
}

export type LoaderData<L> = L extends (...a: never[]) => infer R
  ? Awaited<R> extends Response
    ? never
    : Awaited<R>
  : L;
export type ActionData<A> = A extends (...a: never[]) => infer R ? Awaited<R> : A;

// ── Route render context (set by the framework around SSR) ──────────────────
// A module-level store (not AsyncLocalStorage) so this module stays safe to
// bundle for the browser; the framework sets it synchronously around the SSR
// render, and route data hooks read it.

export interface RouteRenderContext {
  request: RouteRequest;
  loaderData: unknown;
  actionData: unknown;
  loaders: Record<string, unknown>;
}

// Stored on globalThis so the framework (dev server / build) and the user's
// bundled page share one context even if they resolve to separate copies of
// this module (symlinked workspace vs hoisted node_modules).
interface CtxBox {
  current: RouteRenderContext | null;
}
function ctxBox(): CtxBox {
  const g = globalThis as unknown as { __SR_ROUTE_CTX__?: CtxBox };
  if (!g.__SR_ROUTE_CTX__) g.__SR_ROUTE_CTX__ = { current: null };
  return g.__SR_ROUTE_CTX__;
}

/** @internal — framework use only. */
export function __setRouteContext(ctx: RouteRenderContext | null): void {
  ctxBox().current = ctx;
}

export function useLoaderData<L = unknown>(): LoaderData<L> {
  return (ctxBox().current?.loaderData) as LoaderData<L>;
}
export function useActionData<A = unknown>(): ActionData<A> | undefined {
  return (ctxBox().current?.actionData) as ActionData<A> | undefined;
}
export function useRouteRequest(): RouteRequest | undefined {
  return ctxBox().current?.request;
}
export function useLoaderDataFor<T = unknown>(segment: string): T | undefined {
  return ctxBox().current?.loaders[segment] as T | undefined;
}
