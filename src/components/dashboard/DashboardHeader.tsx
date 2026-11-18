"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";

type HeaderUser = { name?: string | null; role?: string | null };

export function DashboardHeader() {
  const { data: session } = authClient.useSession();
  const user = session?.user as HeaderUser | undefined;
  return <header className="flex min-h-11 items-center justify-between gap-3 border-b border-[#eee7e1] bg-[#fbf8f5] px-4 sm:px-6 lg:px-8"><div><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-rose-800">{user?.role || "Member"} workspace</p><p className="hidden text-[10px] text-stone-500 sm:block">{user?.name ? `Welcome back, ${user.name}` : "Manage your WedPlan account"}</p></div><Link href="/services" className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[10px] font-semibold text-stone-600 transition hover:bg-white hover:text-rose-900">Browse services<ArrowUpRight size={13} /></Link>
  </header>;
}
