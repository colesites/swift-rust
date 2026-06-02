import type { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
