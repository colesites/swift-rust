import type { AnchorHTMLAttributes, ReactNode } from "react";

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children: ReactNode;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
}

export function Link({ href, prefetch, replace, scroll, children, ...rest }: LinkProps) {
  // The client navigator (runtime/navigator.js) reads these data-* hints to
  // drive SPA navigation. Plain <a> semantics are preserved when JS is off.
  const dataAttrs: Record<string, string> = {};
  if (replace) dataAttrs["data-sr-replace"] = "true";
  if (scroll === false) dataAttrs["data-sr-scroll"] = "false";
  if (prefetch === false) dataAttrs["data-sr-prefetch"] = "false";
  return (
    <a href={href} {...dataAttrs} {...rest}>
      {children}
    </a>
  );
}
