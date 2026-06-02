import type { ReactNode } from "react";

export interface HeadProps {
  children: ReactNode;
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function Head({ children }: HeadProps) {
  return children;
}

export function Title({ children }: { children: ReactNode }) {
  return <title>{children}</title>;
}

export function Meta({
  name,
  content,
  property,
}: {
  name?: string;
  property?: string;
  content: string;
}) {
  return name ? (
    <meta name={name} content={content} />
  ) : (
    <meta property={property} content={content} />
  );
}

export function Style({ children }: { children: ReactNode }) {
  return (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: <style> contents are static CSS at build time
    <style dangerouslySetInnerHTML={{ __html: typeof children === "string" ? children : "" }} />
  );
}
