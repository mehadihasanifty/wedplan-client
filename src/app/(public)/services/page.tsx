import { Flower2 } from "lucide-react";
import { ServiceGrid } from "@/components/services/ServiceGrid";

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ category?: string | string[] }> }) {
  const query = await searchParams;
  const category = Array.isArray(query.category) ? query.category[0] ?? "" : query.category ?? "";
  return <div className="pb-12">
    <header className="relative mb-8 overflow-hidden rounded-[2rem] border border-[#eadfd5] bg-[linear-gradient(120deg,#fffaf6,#f6ece4_58%,#f2e5db)] px-6 py-9 sm:px-10 sm:py-12">
      <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-24 size-72 rounded-full border border-rose-900/[.08]" /><div aria-hidden="true" className="pointer-events-none absolute -right-1 -top-12 size-52 rounded-full border border-rose-900/[.07]" />
      <div className="relative max-w-3xl"><span className="inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-white/75 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-800"><Flower2 size={13} aria-hidden="true" />Made for your day</span><h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] text-[#352321] sm:text-5xl">Find the details that feel <span className="font-serif font-normal italic text-rose-700">like you.</span></h1><p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">Explore trusted wedding professionals, compare the details, and discover the right people for your celebration.</p></div>
    </header>
    <ServiceGrid initialCategory={category} />
  </div>;
}
