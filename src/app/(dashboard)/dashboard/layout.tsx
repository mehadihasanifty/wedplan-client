import type { ReactNode } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
export default function DashboardLayout({ children }: { children: ReactNode }) { return <div className="min-h-screen"><DashboardHeader />{children}</div>; }
