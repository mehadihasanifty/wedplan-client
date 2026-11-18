"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Flower2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { syncApiToken } from "@/lib/api-auth";

type AppRole = "customer" | "vendor" | "admin";
type UserWithRole = { role?: AppRole | null };

export default function AuthRedirectPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.replace("/signin");
      return;
    }
    let active = true;
    const user = session.user as UserWithRole;
    syncApiToken().then(() => {
      if (!active) return;
      router.replace(user.role ? `/dashboard/${user.role}` : "/dashboard");
      router.refresh();
    }).catch(() => {
      if (active) router.replace("/signin?error=api-session");
    });
    return () => { active = false; };
  }, [isPending, router, session]);

  return <main className="flex min-h-[55vh] items-center justify-center"><div role="status" className="flex flex-col items-center gap-3 rounded-3xl border border-rose-100 bg-white/90 px-8 py-7 text-center shadow-lg shadow-rose-950/5"><span className="flex size-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-800"><Flower2 aria-hidden="true" size={22} /></span><p className="text-sm font-semibold text-stone-800">Welcome back to WedPlan</p><p className="text-xs text-stone-500">Taking you to your workspace…</p></div></main>;
}
