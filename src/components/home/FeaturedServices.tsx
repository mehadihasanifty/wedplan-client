"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/home/Reveal";
import { ServiceCard } from "@/components/services/ServiceCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Loading } from "@/components/shared/Loading";
import { getServices } from "@/services/service-api";
import type { Service } from "@/types";

export function FeaturedServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let active = true;
    getServices({ status: "approved", isActive: "true", limit: 18 })
      .then(results => {
        if (!active) return;
        setServices(results.filter(service => service.status === "approved" && service.isActive === true).slice(0, 6));
        setHasError(false);
      })
      .catch(() => { if (active) setHasError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <Reveal>
      <section aria-labelledby="featured-title" className="py-12 sm:py-16">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700 dark:text-rose-300">Thoughtfully selected</p><h2 id="featured-title" className="mt-2 text-3xl font-semibold tracking-tight">Featured wedding services</h2><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Explore approved, available services from vendors on WedPlan.</p></div>
          <Link href="/services" className="group inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-semibold text-rose-800 transition hover:bg-rose-50 sm:self-auto dark:text-rose-200 dark:hover:bg-rose-950/40">Browse all services<ArrowRight aria-hidden="true" size={16} className="transition-transform group-hover:translate-x-1" /></Link>
        </div>
        {loading ? <Loading label="Finding lovely services for you…" /> : hasError ? <ErrorState message="Featured services could not be loaded right now. Please try browsing all services." /> : services.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{services.map((service, index) => <Reveal key={service.id ?? service._id ?? `${service.serviceName}-${index}`} delay={index * 0.06}><ServiceCard service={service} /></Reveal>)}</div> : <EmptyState title="New services are on their way" description="Approved and available wedding services will appear here. Browse all categories to see what is available." />}
      </section>
    </Reveal>
  );
}
