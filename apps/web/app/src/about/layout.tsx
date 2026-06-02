import type { ReactNode } from "react";

export default function AboutLayout({ children }: { children: ReactNode }) {
  return <div className="container-page py-16 sm:py-20">{children}</div>;
}
