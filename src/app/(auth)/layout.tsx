import type { ReactNode } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="flex min-h-screen flex-col">
    <Navbar />
    <main className="relative isolate flex flex-1 items-center justify-center overflow-hidden px-4 py-8 sm:px-6 sm:py-12">
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-36 -z-10 size-[28rem] rounded-full bg-rose-200/30 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-32 -z-10 size-[32rem] rounded-full bg-amber-100/40 blur-3xl" />
      <div className="w-full max-w-5xl">{children}</div>
    </main>
    <Footer />
  </div>;
}
