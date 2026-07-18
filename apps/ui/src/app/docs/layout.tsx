import type { ReactNode } from "react";
import { DocsSidebar } from "@/components/site/docs-sidebar";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] w-full lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="hidden border-r border-border px-4 py-8 lg:block">
        <DocsSidebar />
      </aside>
      <div className="min-w-0 px-6 py-10 sm:px-8 lg:px-10 xl:px-12">{children}</div>
    </div>
  );
}
