import type { ReactNode } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
export default function DashboardLayout({ children }: { children: ReactNode }) { return <div className="flex min-h-screen flex-col"><Navbar /><DashboardHeader /><div className="flex-1">{children}</div><Footer /></div>; }
