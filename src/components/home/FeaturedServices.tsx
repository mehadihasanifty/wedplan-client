"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/home/Reveal";
import { ServiceCard } from "@/components/services/ServiceCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Loading } from "@/components/shared/Loading";
import { getPublicServices } from "@/services/service-api";
import type { Service } from "@/types";

export function FeaturedServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let active = true;
    getPublicServices({ limit: 18 })
      .then((results) => {
        if (!active) return;
        setServices(
          results
            .filter(
              (service) =>
                service.status === "approved" && service.isActive === true,
            )
            .slice(0, 6),
        );
        setHasError(false);
      })
      .catch(() => {
        if (active) setHasError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <Reveal>
      <section aria-labelledby="featured-title" className="py-16 sm:py-20">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-800">
              A thoughtful place to begin
            </p>
            <h2
              id="featured-title"
              className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl"
            >
              Possibilities for your kind of day.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-stone-600 sm:text-base">
              Explore approved, available services from wedding professionals on
              WedPlan.
            </p>
          </div>
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 self-start rounded-full border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-900 shadow-sm transition hover:border-rose-300 hover:bg-rose-50 sm:self-auto"
          >
            Browse all services
            <ArrowRight
              aria-hidden="true"
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
        {loading ? (
          <Loading label="Finding lovely services for you…" />
        ) : hasError ? (
          <ErrorState message="Featured services could not be loaded right now. Please try browsing all services." />
        ) : services.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Reveal
                key={
                  service.id ?? service._id ?? `${service.serviceName}-${index}`
                }
                delay={index * 0.06}
              >
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            title="New services are on their way"
            description="Approved and available wedding services will appear here. Browse all categories to see what is available."
          />
        )}
      </section>
    </Reveal>
  );
}
