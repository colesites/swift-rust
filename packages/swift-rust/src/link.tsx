import type { AnchorHTMLAttributes, ReactNode } from "react";

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children: ReactNode;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
}

export function Link({
  href,
  prefetch: _prefetch,
  replace: _replace,
  scroll: _scroll,
  children,
  ...rest
}: LinkProps) {
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
