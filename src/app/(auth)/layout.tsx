import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <main className="flex min-h-screen items-center justify-center px-5 py-10"><div className="w-full max-w-md"><Link href="/" className="mb-8 block text-center text-2xl font-semibold">WedPlan</Link>{children}</div></main>;
}
