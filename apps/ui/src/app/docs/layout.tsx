import type { ReactNode } from "react";
import { DocsSidebar } from "@/components/site/docs-sidebar";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] w-full xl:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="hidden border-r border-border xl:block">
        <DocsSidebar />
      </aside>
      <div className="min-w-0 px-5 py-9 sm:px-8 sm:py-10 md:px-10 lg:px-12 xl:px-10 2xl:px-12">
        {children}
      </div>
    </div>
  );
}
