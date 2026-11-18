"use client";

import Link from "next/link";
import { ArrowUpRight, Camera, Flower2, Landmark, Shirt, Sparkles, Utensils } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/home/Reveal";

const categories = [
  { name: "Photography & Videography", note: "Keep every moment close", icon: Camera, tone: "bg-rose-100 text-rose-800  " },
  { name: "Wedding Venues", note: "Find a place that feels like you", icon: Landmark, tone: "bg-amber-100 text-amber-900  " },
  { name: "Decoration & Florist", note: "Set the scene with every detail", icon: Flower2, tone: "bg-emerald-100 text-emerald-900  " },
  { name: "Catering Services", note: "Make room for something delicious", icon: Utensils, tone: "bg-orange-100 text-orange-900  " },
  { name: "Makeup & Styling", note: "Feel like your most radiant self", icon: Sparkles, tone: "bg-violet-100 text-violet-900  " },
  { name: "Wedding Fashion", note: "Find the look that feels like you", icon: Shirt, tone: "bg-sky-100 text-sky-900  " },
];

export function Categories() {
  const reduceMotion = useReducedMotion();
  return (
    <Reveal>
      <section aria-labelledby="categories-title" className="relative isolate overflow-hidden rounded-[2rem] border border-rose-100/80 bg-[#f7f1eb] px-5 py-10 sm:px-9 sm:py-14">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 -z-10 size-80 rounded-full bg-rose-200/35 blur-3xl" />
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700 ">Start with what matters</p><h2 id="categories-title" className="mt-2 text-3xl font-semibold tracking-tight">Explore by category</h2></div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">Browse the details that make a celebration feel unmistakably yours.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ name, note, icon: Icon, tone }, index) => <motion.div key={name} whileHover={reduceMotion ? undefined : { y: -5 }} whileTap={reduceMotion ? undefined : { scale: 0.99 }} transition={{ type: "spring", stiffness: 330, damping: 24 }}>
            <Link href={`/services?category=${encodeURIComponent(name)}`} className="group flex min-h-[132px] items-center gap-4 rounded-2xl border border-white/90 bg-white/85 p-5 shadow-[0_5px_22px_-18px_rgba(79,43,39,.42)] transition-all duration-200 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-950/7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 sm:p-6">
              <motion.span className={`flex size-14 shrink-0 items-center justify-center rounded-[1.15rem] ${tone}`} whileHover={reduceMotion ? undefined : { rotate: -7, scale: 1.08 }} transition={{ type: "spring", stiffness: 380, damping: 18 }}><Icon aria-hidden="true" size={23} strokeWidth={1.65} /></motion.span>
              <span className="min-w-0 flex-1"><span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-700/75">{String(index + 1).padStart(2, "0")} / DISCOVER</span><span className="block font-semibold leading-snug">{name}</span><span className="mt-1 block text-sm text-muted-foreground">{note}</span></span>
              <ArrowUpRight aria-hidden="true" size={17} className="shrink-0 text-stone-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-rose-700" />
            </Link>
          </motion.div>)}
        </div>
      </section>
    </Reveal>
  );
}

