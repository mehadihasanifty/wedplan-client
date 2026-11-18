"use client";

import Link from "next/link";
import { ArrowUpRight, Flower2, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Service } from "@/types";

export function ServiceCard({ service }: { service: Service }) {
  const reduceMotion = useReducedMotion();
  const id = service.id ?? service._id;
  const image = service.images?.[0] ?? service.serviceImage;
  const vendorName = service.vendor?.businessName || service.vendor?.name || service.businessName || service.vendorName || "Wedding professional";
  const price = service.currency
    ? new Intl.NumberFormat("en", { style: "currency", currency: service.currency, maximumFractionDigits: 0 }).format(service.price)
    : service.price.toLocaleString("en");

  return (
    <motion.article style={{ transformPerspective: 1100, transformStyle: "preserve-3d" }} whileHover={reduceMotion ? undefined : { y: -7, scale: 1.012, rotateX: 1.2 }} whileTap={reduceMotion ? undefined : { scale: 0.995 }} transition={{ type: "spring", stiffness: 280, damping: 23, mass: 0.7 }} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-[border-color,box-shadow] duration-300 hover:border-rose-200 hover:shadow-xl hover:shadow-rose-950/8">
      <Link href={id ? `/services/${encodeURIComponent(id)}` : "/services"} aria-label={`View ${service.serviceName} details`} className="relative block aspect-[1.55/1] overflow-hidden bg-gradient-to-br from-rose-100 via-[#f8eee4] to-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rose-500   ">
        {image ? <div role="img" aria-label={`${service.serviceName} service`} className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url("${image}")` }} /> : <div className="absolute inset-0 flex items-center justify-center"><span className="flex size-16 items-center justify-center rounded-full border border-white/70 bg-white/55 text-rose-800 shadow-sm backdrop-blur-sm   "><Flower2 aria-hidden="true" size={28} strokeWidth={1.4} /></span></div>}
        <span className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/90 px-3 py-1.5 text-xs font-medium text-stone-800 shadow-sm backdrop-blur">{service.category}</span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3"><h3 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight">{service.serviceName}</h3><p className="shrink-0 text-sm font-semibold text-rose-800 "><span className="sr-only">Starting at </span>{price}<span className="ml-1 text-xs font-normal text-muted-foreground">/ package</span></p></div>
        <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin aria-hidden="true" size={15} className="shrink-0 text-rose-700 " /><span className="truncate">{service.location}</span></div>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/70 pt-4">
          <div className="min-w-0"><p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Provided by</p><p className="truncate text-sm font-medium">{vendorName}</p></div>
          <Link href={id ? `/services/${encodeURIComponent(id)}` : "/services"} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-800 transition hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500   ">View details<ArrowUpRight aria-hidden="true" size={14} /></Link>
        </div>
      </div>
    </motion.article>
  );
}

