import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6 sm:py-12">
    <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-36 -z-10 size-[28rem] rounded-full bg-rose-200/30 blur-3xl" />
    <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-32 -z-10 size-[32rem] rounded-full bg-amber-100/40 blur-3xl" />
    <div className="w-full max-w-5xl">
      <Link href="/" aria-label="WedPlan home" className="mb-6 inline-flex items-center gap-2.5 rounded-full px-2 py-1.5 text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400">
        <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-white to-rose-100 text-sm font-semibold text-rose-900 shadow-sm ring-1 ring-rose-200/80">W</span>
        <span className="text-lg font-semibold tracking-[-0.04em]">Wed<span className="text-rose-800">Plan</span></span>
      </Link>
      {children}
    </div>
  </main>;
}
