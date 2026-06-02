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
