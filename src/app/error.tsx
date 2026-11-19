"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    toast.error("We couldn’t load this page", { description: "Please try again. Your account data has not been changed." });
  }, []);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-5 py-16">
      <section role="alert" className="w-full max-w-xl rounded-[2rem] border border-rose-200 bg-white p-8 text-center shadow-[0_28px_75px_-55px_rgba(82,43,44,.5)] sm:p-12">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-800"><TriangleAlert size={23} /></span>
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-800">Something went wrong</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#352321]">This page didn’t finish loading</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-stone-600">Please retry. If the problem continues, return to WedPlan and try again later.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="inline-flex h-11 items-center gap-2 rounded-full bg-rose-800 px-5 text-sm font-semibold text-white transition hover:bg-rose-900"><RefreshCw size={15} />Try again</button>
          <Link href="/" className="inline-flex h-11 items-center rounded-full border border-[#eadfd5] px-5 text-sm font-semibold text-stone-700 transition hover:bg-[#fffaf6]">Back home</Link>
        </div>
      </section>
    </main>
  );
}
