"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Loading } from "@/components/shared/Loading";

type CustomerSessionUser = { role?: "admin" | "vendor" | "customer" | null };

export default function CustomerLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as CustomerSessionUser | undefined;

  useEffect(() => {
    if (isPending) return;
    if (!session) router.replace(`/signin?callbackURL=${encodeURIComponent(window.location.pathname)}`);
    else if (user?.role && user.role !== "customer") router.replace(`/dashboard/${user.role}`);
    else if (!user?.role) router.replace("/dashboard");
  }, [isPending, router, session, user?.role]);

  if (isPending || !session || user?.role !== "customer") {
    return <div className="py-12"><Loading label="Preparing your customer workspace…" /></div>;
  }

  return <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-[258px_minmax(0,1fr)]"><DashboardSidebar role="customer" /><main className="min-w-0 bg-[#fbf8f5] p-4 sm:p-6 lg:p-9">{children}</main></div>;
}
