import Link from "next/link";
import { ArrowLeft, Flower2 } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-5 py-16">
      <section className="w-full max-w-xl rounded-[2rem] border border-[#eadfd5] bg-[linear-gradient(140deg,#fffdfa,#fff5ef)] p-8 text-center shadow-[0_28px_75px_-55px_rgba(82,43,44,.5)] sm:p-12">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-rose-100 bg-white text-rose-800 shadow-sm"><Flower2 size={23} /></span>
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-800">A little detour</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#352321]">We couldn’t find that page</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-stone-600">The link may be out of date, or the page may have moved. Let’s get you back to planning.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex h-11 items-center gap-2 rounded-full bg-rose-800 px-5 text-sm font-semibold text-white transition hover:bg-rose-900"><ArrowLeft size={15} />Back home</Link>
          <Link href="/services" className="inline-flex h-11 items-center rounded-full border border-[#eadfd5] bg-white px-5 text-sm font-semibold text-stone-700 transition hover:bg-[#fffaf6]">Browse services</Link>
        </div>
      </section>
    </main>
  );
}
