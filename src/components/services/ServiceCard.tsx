"use client";

import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Flower2, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import type { Service } from "@/types";

export function ServiceCard({ service }: { service: Service }) {
  const reduceMotion = useReducedMotion();
  const { data: session } = authClient.useSession();
  const id = service.id ?? service._id;
  const detailPath = id ? `/services/${encodeURIComponent(id)}` : "/services";
  const detailHref = session?.user ? detailPath : `/signin?callbackURL=${encodeURIComponent(detailPath)}`;
  const image = service.images?.[0];
  const vendorName = service.vendor?.businessName || service.vendor?.name || "Wedding professional";
  const vendorImage = service.vendor?.image;
  const vendorInitials = vendorName.split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
  const price = service.currency
    ? new Intl.NumberFormat("en", { style: "currency", currency: service.currency, maximumFractionDigits: 0 }).format(service.price)
    : service.price.toLocaleString("en");

  return (
    <motion.article style={{ transformPerspective: 1100, transformStyle: "preserve-3d" }} whileHover={reduceMotion ? undefined : { y: -7, scale: 1.012, rotateX: 1.2 }} whileTap={reduceMotion ? undefined : { scale: 0.995 }} transition={{ type: "spring", stiffness: 280, damping: 23, mass: 0.7 }} className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-[#eee4dd] bg-white shadow-[0_12px_32px_-26px_rgba(65,39,37,.5)] transition-[border-color,box-shadow] duration-300 hover:border-rose-200 hover:shadow-[0_24px_50px_-30px_rgba(82,43,44,.34)]">
      <Link href={detailHref} aria-label={`View ${service.serviceName} details`} className="relative block aspect-[1.55/1] overflow-hidden bg-gradient-to-br from-rose-100 via-[#f8eee4] to-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rose-500">
        {image ? <div role="img" aria-label={`${service.serviceName} service`} className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.06]" style={{ backgroundImage: `url("${image}")` }} /> : <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,.75),transparent_65%)]"><span className="flex size-[4.5rem] items-center justify-center rounded-[1.5rem] border border-white/80 bg-white/65 text-rose-800 shadow-sm backdrop-blur-sm"><Flower2 aria-hidden="true" size={30} strokeWidth={1.35} /></span></div>}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#332021]/40 via-transparent to-[#332021]/5 opacity-70 transition-opacity duration-300 group-hover:opacity-90" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-stone-800 shadow-sm backdrop-blur"><BadgeCheck aria-hidden="true" size={13} className="text-rose-800" />{service.category}</span>
        <span aria-hidden="true" className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border border-white/70 bg-white/85 text-stone-800 shadow-sm backdrop-blur transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-rose-800 group-hover:text-white"><ArrowUpRight size={16} /></span>
        <span className="absolute bottom-4 left-4 rounded-full border border-white/35 bg-[#fffaf6]/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-rose-950 shadow-sm backdrop-blur">A WedPlan professional</span>
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-5">
        <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-800/75">Wedding service</p><h3 className="mt-1.5 line-clamp-2 text-lg font-semibold leading-snug tracking-[-0.025em] text-stone-900">{service.serviceName}</h3></div><p className="shrink-0 rounded-xl bg-[#fbf5f1] px-3 py-2 text-right text-sm font-semibold text-rose-900"><span className="sr-only">Starting at </span>{price}<span className="mt-0.5 block text-[10px] font-normal text-stone-500">per package</span></p></div>
        <div className="mt-3 flex items-center gap-1.5 text-sm text-stone-500"><MapPin aria-hidden="true" size={15} className="shrink-0 text-rose-700" /><span className="truncate">{service.location}</span></div>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#f0e8e2] pt-4">
          <div className="flex min-w-0 items-center gap-2.5"><span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-rose-100 bg-gradient-to-br from-rose-100 to-[#f2ded3] text-[10px] font-semibold text-rose-900">{vendorImage ? <span role="img" aria-label={`${vendorName} profile`} className="size-full bg-cover bg-center" style={{ backgroundImage: `url("${vendorImage}")` }} /> : vendorInitials}</span><div className="min-w-0"><p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-stone-500">By</p><p className="truncate text-xs font-semibold text-stone-800">{vendorName}</p></div></div>
          <Link href={detailHref} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-rose-800 px-3.5 py-2.5 text-xs font-semibold text-white shadow-sm shadow-rose-950/10 transition hover:bg-rose-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2">View details<ArrowUpRight aria-hidden="true" size={14} /></Link>
        </div>
      </div>
    </motion.article>
  );
}

