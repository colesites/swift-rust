import type { ReactNode } from "react";

export default function AboutLayout({ children }: { children: ReactNode }) {
  return <div className="container-page py-12 sm:py-16">{children}</div>;
}
