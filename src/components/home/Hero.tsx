"use client";

import Link from "next/link";
import { ArrowDown, ArrowRight, Heart, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/home/Reveal";
import { HeroArtwork } from "@/components/home/HeroArtwork";

export function Hero() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#fbf6f1] px-6 py-10  sm:px-10 sm:py-14 lg:px-14 lg:py-16">
      <div aria-hidden="true" className="pointer-events-none absolute -left-28 top-8 size-72 rounded-full bg-rose-200/40 blur-3xl " />
      <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <Reveal className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-white/80 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-rose-800 shadow-sm   "><Sparkles aria-hidden="true" size={14} />Wedding planning, made personal</div>
          <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-[#352321]  sm:text-5xl lg:text-6xl">Find the people who make your day <motion.span initial={reduceMotion ? false : { opacity: 0, clipPath: "inset(0 100% 0 0)" }} animate={reduceMotion ? undefined : { opacity: 1, clipPath: "inset(0 0% 0 0)" }} transition={{ duration: reduceMotion ? 0 : 0.9, delay: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }} className="inline-block font-serif font-normal italic text-rose-700 ">unforgettable.</motion.span></h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-stone-600  sm:text-lg sm:leading-8">From the first idea to the final detail, discover wedding professionals who bring your celebration to life.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/services" className="group inline-flex items-center justify-center gap-2 rounded-full bg-rose-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-950/15 transition hover:-translate-y-0.5 hover:bg-rose-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2   ">Explore Wedding Services<ArrowRight aria-hidden="true" size={17} className="transition-transform group-hover:translate-x-1" /></Link>
            <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-medium text-stone-700 transition hover:bg-white/70  ">See how it works<ArrowDown aria-hidden="true" size={15} /></a>
          </div>
          <div className="mt-9 flex items-center gap-3 text-sm text-stone-600 "><span className="flex -space-x-2"><span className="flex size-8 items-center justify-center rounded-full border-2 border-[#fbf6f1] bg-rose-200 text-rose-800 "><Heart aria-hidden="true" size={13} /></span><span className="flex size-8 items-center justify-center rounded-full border-2 border-[#fbf6f1] bg-amber-100 text-amber-800 "><Sparkles aria-hidden="true" size={13} /></span></span><span>One thoughtful place for your wedding plans</span></div>
        </Reveal>
        <HeroArtwork />
      </div>
    </section>
  );
}

