"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { getServices } from "@/services/service-api";
import type { Service } from "@/types";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServiceFilters, type ServiceFilterValues } from "@/components/services/ServiceFilters";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";

const PAGE_SIZE = 9;

export function ServiceGrid({ initialCategory = "" }: { initialCategory?: string }) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ServiceFilterValues>({ search: "", category: initialCategory, location: "", sort: "" });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let active = true;
    getServices({ status: "approved", isActive: "true", limit: 100 })
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
      <div className="mb-5 mt-8 flex items-end justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-rose-800">The WedPlan collection</p><h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-900">Wedding services</h2></div>{!loading && !error && <p className="text-sm text-stone-500">{filtered.length} {filtered.length === 1 ? "service" : "services"}</p>}</div>

      {loading ? <Loading label="Finding wedding services…" /> : error ? <ErrorState message="We couldn’t load services just now. Please refresh the page and try again." /> : filtered.length === 0 ? <EmptyState title={services.length ? "No services match those filters" : "New services are on their way"} description={services.length ? "Try a different search or clear some filters to see more options." : "Approved and active wedding professionals will appear here as they join WedPlan."} /> : <>
        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{visible.map((service, index) => <motion.div layout key={service.id ?? service._id ?? `${service.serviceName}-${index}`} initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : (index % PAGE_SIZE) * 0.035 }}><ServiceCard service={service} /></motion.div>)}</motion.div>
        {pageCount > 1 && <nav aria-label="Service listing pages" className="mt-9 flex items-center justify-center gap-3"><button type="button" onClick={() => setPage(current => Math.max(1, current - 1))} disabled={page === 1} className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"><ArrowLeft size={15} />Previous</button><span aria-live="polite" className="min-w-24 text-center text-sm text-stone-600">Page {page} of {pageCount}</span><button type="button" onClick={() => setPage(current => Math.min(pageCount, current + 1))} disabled={page === pageCount} className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40">Next<ArrowRight size={15} /></button></nav>}
      </>}
    </div>
  );
}
