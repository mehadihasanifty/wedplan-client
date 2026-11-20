import { Suspense, type ReactNode } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<div aria-hidden="true" className="h-20" />}>
        <Navbar />
      </Suspense>
      <DashboardHeader />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
