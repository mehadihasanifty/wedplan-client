import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
export default function AdminLayout({ children }: { children: ReactNode }) { return <div className="grid min-h-[calc(100vh-65px)] md:grid-cols-[230px_1fr]"><DashboardSidebar role="admin" /><main className="p-6 md:p-10">{children}</main></div>; }
