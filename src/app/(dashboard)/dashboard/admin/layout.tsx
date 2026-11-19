import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { AdminAccessGuard } from "@/components/dashboard/admin/AdminAccessGuard";

export const instant = false;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAccessGuard>
      <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-[258px_minmax(0,1fr)]">
        <DashboardSidebar role="admin" />
        <main className="min-w-0 bg-[#fbf8f5] p-4 sm:p-6 lg:p-9">
          {children}
        </main>
      </div>
    </AdminAccessGuard>
  );
}
