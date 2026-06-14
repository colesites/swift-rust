import type { ReactNode } from "react";
import { DocsSidebar } from "@/components/site/docs-sidebar";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container-page grid gap-10 py-12 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <DocsSidebar />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
