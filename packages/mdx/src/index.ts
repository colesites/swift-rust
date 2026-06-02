import type { ReactNode } from "react";

export interface MdxProviderProps {
  children: ReactNode;
  components?: Record<string, React.ComponentType<unknown>>;
}

export function MDXProvider({ children, components = {} }: MdxProviderProps) {
  void components;
  return children;
}

export const mdxOptions = {
  remarkPlugins: [],
  rehypePlugins: [],
  format: "mdx" as const,
};

export default { MDXProvider, mdxOptions };
