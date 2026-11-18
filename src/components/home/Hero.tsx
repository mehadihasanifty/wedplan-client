"use client";

import Link from "next/link";
import { ArrowDown, ArrowRight, Heart, Sparkles, WandSparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/home/Reveal";
import { HeroArtwork } from "@/components/home/HeroArtwork";

export function Hero() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] border border-[#eadfd5] bg-[linear-gradient(125deg,#fffaf6_0%,#f9f1e9_48%,#f3e7df_100%)] px-6 py-10 shadow-[0_28px_90px_-62px_rgba(77,43,38,.55)] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
      <div aria-hidden="true" className="pointer-events-none absolute -left-28 top-8 size-72 rounded-full bg-rose-200/40 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 size-[26rem] rounded-full border border-rose-900/[.07]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-12 size-[22rem] rounded-full border border-rose-900/[.06]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-[48%] top-0 hidden w-px bg-gradient-to-b from-transparent via-rose-900/[.08] to-transparent lg:block" />
      <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <Reveal className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-white/80 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-rose-800 shadow-sm"><WandSparkles aria-hidden="true" size={14} />A considered way to plan</div>
          <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-[#352321] sm:text-5xl lg:text-[4.15rem]">Find the people who make your day <motion.span initial={reduceMotion ? false : { opacity: 0, clipPath: "inset(0 100% 0 0)" }} animate={reduceMotion ? undefined : { opacity: 1, clipPath: "inset(0 0% 0 0)" }} transition={{ duration: reduceMotion ? 0 : 0.9, delay: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }} className="inline-block font-serif font-normal italic text-rose-700">unforgettable.</motion.span></h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-stone-600  sm:text-lg sm:leading-8">From the first idea to the final detail, discover wedding professionals who bring your celebration to life.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/services" className="group inline-flex items-center justify-center gap-2 rounded-full bg-rose-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-950/15 transition hover:-translate-y-0.5 hover:bg-rose-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2   ">Explore Wedding Services<ArrowRight aria-hidden="true" size={17} className="transition-transform group-hover:translate-x-1" /></Link>
            <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-medium text-stone-700 transition hover:bg-white/70  ">See how it works<ArrowDown aria-hidden="true" size={15} /></a>
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-rose-950/10 pt-5 text-xs font-medium text-stone-600 sm:text-sm"><span className="inline-flex items-center gap-2"><Heart aria-hidden="true" size={15} className="text-rose-700" />People who understand your vision</span><span className="hidden h-4 w-px bg-rose-950/15 sm:block" /><span className="inline-flex items-center gap-2"><Sparkles aria-hidden="true" size={15} className="text-amber-700" />Every detail, in one thoughtful place</span></div>
        </Reveal>
        <HeroArtwork />
      </div>
    </section>
  );
}

