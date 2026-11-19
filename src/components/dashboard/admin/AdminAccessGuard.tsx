"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Loading } from "@/components/shared/Loading";

type SessionUser = { role?: "admin" | "vendor" | "customer" | null };

export function AdminAccessGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as SessionUser | undefined;

  useEffect(() => {
    if (isPending) return;
    if (!session)
      router.replace(`/signin?callbackURL=${encodeURIComponent(pathname)}`);
    else if (user?.role && user.role !== "admin")
      router.replace(`/dashboard/${user.role}`);
    else if (!user?.role) router.replace("/dashboard");
  }, [isPending, pathname, router, session, user?.role]);

  if (isPending || !session || user?.role !== "admin") {
    return (
      <div className="py-12">
        <Loading label="Verifying admin access…" />
      </div>
    );
  }
  return children;
}
