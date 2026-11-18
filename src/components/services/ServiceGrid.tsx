"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Flower2, SlidersHorizontal } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { getPublicServices } from "@/services/service-api";
import type { Service } from "@/types";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServiceFilters, type ServiceFilterValues } from "@/components/services/ServiceFilters";
import { ErrorState } from "@/components/shared/ErrorState";

const PAGE_SIZE = 9;

export function ServiceGrid() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "";
  return <ServiceGridContent key={initialCategory} initialCategory={initialCategory} />;
}

function ServiceGridContent({ initialCategory }: { initialCategory: string }) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ServiceFilterValues>(() => ({ search: "", category: initialCategory, location: "", sort: "" }));
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let active = true;
    getPublicServices({ limit: 100 })
      .then(data => { if (active) { setServices(data.filter(service => service.status === "approved" && service.isActive === true)); setError(false); } })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const locations = useMemo(() => [...new Set(services.map(service => service.location).filter(Boolean))].sort((a, b) => a.localeCompare(b)), [services]);
  const filtered = useMemo(() => {
    const needle = filters.search.trim().toLocaleLowerCase();
    const result = services.filter(service => (!needle || service.serviceName.toLocaleLowerCase().includes(needle)) && (!filters.category || service.category === filters.category) && (!filters.location || service.location === filters.location));
    if (filters.sort === "low") result.sort((a, b) => a.price - b.price);
    if (filters.sort === "high") result.sort((a, b) => b.price - a.price);
    return result;
  }, [services, filters]);
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function updateFilters(next: ServiceFilterValues) { setFilters(next); setPage(1); }

  return (
    <div>
      <ServiceFilters values={filters} onChange={updateFilters} locations={locations} onReset={() => updateFilters({ search: "", category: "", location: "", sort: "" })} />
      <div className="mb-5 mt-9 flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-rose-800">The WedPlan collection</p><h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-stone-900">Wedding services</h2></div>{!loading && !error && <p aria-live="polite" className="rounded-full border border-[#eee3dc] bg-white px-3.5 py-2 text-xs font-semibold text-stone-600 shadow-sm">{filtered.length} {filtered.length === 1 ? "service" : "services"}{filters.category && <span className="ml-1 text-rose-800">· {filters.category}</span>}</p>}</div>

      {loading ? <ServiceSkeleton /> : error ? <ErrorState message="We couldn’t load services just now. Please refresh the page and try again." /> : filtered.length === 0 ? <div className="rounded-[1.8rem] border border-dashed border-rose-200 bg-[linear-gradient(135deg,#fffaf6,#fbf5f0)] px-6 py-14 text-center"><span className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-rose-100 bg-white text-rose-800 shadow-sm"><Flower2 aria-hidden="true" size={23} /></span><h3 className="mt-4 text-lg font-semibold tracking-tight text-stone-900">{services.length ? "No services match those filters" : "A lovely collection is taking shape"}</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">{services.length ? "Try another search or clear your filters to explore more wedding professionals." : "Approved and active wedding professionals will appear here as they join WedPlan."}</p>{services.length > 0 && <button type="button" onClick={() => updateFilters({ search: "", category: "", location: "", sort: "" })} className="mt-5 inline-flex items-center gap-2 rounded-full bg-rose-800 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-rose-900"><SlidersHorizontal size={14} />Clear your filters</button>}</div> : <>
        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{visible.map((service, index) => <motion.div layout key={service.id ?? service._id ?? `${service.serviceName}-${index}`} initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : (index % PAGE_SIZE) * 0.035 }}><ServiceCard service={service} /></motion.div>)}</motion.div>
        {pageCount > 1 && <nav aria-label="Service listing pages" className="mt-10 flex items-center justify-center gap-3"><button type="button" onClick={() => setPage(current => Math.max(1, current - 1))} disabled={page === 1} className="inline-flex items-center gap-2 rounded-full border border-[#eadfd5] bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"><ArrowLeft size={15} />Previous</button><span aria-live="polite" className="min-w-24 rounded-full bg-[#f6eee8] px-4 py-2 text-center text-xs font-semibold text-stone-700">{String(page).padStart(2, "0")} <span className="text-stone-400">/</span> {String(pageCount).padStart(2, "0")}</span><button type="button" onClick={() => setPage(current => Math.min(pageCount, current + 1))} disabled={page === pageCount} className="inline-flex items-center gap-2 rounded-full border border-[#eadfd5] bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40">Next<ArrowRight size={15} /></button></nav>}
      </>}
    </div>
  );
}

function ServiceSkeleton() {
  return <div role="status" aria-label="Finding wedding services" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="overflow-hidden rounded-[1.6rem] border border-[#eee4dd] bg-white p-3.5 shadow-sm"><div className="aspect-[1.55/1] animate-pulse rounded-[1.1rem] bg-gradient-to-br from-rose-100 via-[#f8eee4] to-amber-100 motion-reduce:animate-none" /><div className="px-1 pb-1 pt-4"><div className="h-3 w-24 animate-pulse rounded bg-rose-100 motion-reduce:animate-none" /><div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-stone-100 motion-reduce:animate-none" /><div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-stone-100 motion-reduce:animate-none" /><div className="mt-5 border-t border-[#f0e8e2] pt-4"><div className="h-9 animate-pulse rounded-full bg-[#fbf5f1] motion-reduce:animate-none" /></div></div></div>)}<span className="sr-only">Loading</span></div>;
}
