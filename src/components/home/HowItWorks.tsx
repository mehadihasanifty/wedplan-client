"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Search, Send } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/home/Reveal";

const steps = [
  { number: "01", icon: Search, title: "Explore what feels right", description: "Browse approved services and start with the categories that matter to you." },
  { number: "02", icon: CalendarDays, title: "Find your people", description: "Compare details, locations, and pricing to choose the right fit." },
  { number: "03", icon: Send, title: "Bring your plans together", description: "Send booking requests and keep track of each one in your dashboard." },
];

export function HowItWorks() {
  const reduceMotion = useReducedMotion();
  return (
    <Reveal>
      <section id="how-it-works" aria-labelledby="how-title" className="py-16 sm:py-20">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-800">A little at a time</p><h2 id="how-title" className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">From first thought to “I do”.</h2></div>
          <p className="max-w-md text-sm leading-7 text-stone-600">Your plans can take shape one thoughtful decision at a time.</p>
        </div>
        <div className="relative grid gap-9 md:grid-cols-3 md:gap-5">
          <motion.div aria-hidden="true" initial={reduceMotion ? false : { scaleX: 0 }} whileInView={reduceMotion ? undefined : { scaleX: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: reduceMotion ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }} className="absolute left-[16.67%] right-[16.67%] top-7 hidden h-px origin-left bg-gradient-to-r from-rose-200 via-rose-300 to-rose-200 md:block" />
          {steps.map(({ number, icon: Icon, title, description }, index) => <Reveal key={number} delay={index * 0.1} className="relative z-10">
            <article className="h-full rounded-3xl border border-rose-100/80 bg-white/80 px-6 py-7 text-center shadow-[0_14px_38px_-30px_rgba(82,43,44,.38)] transition-shadow hover:shadow-[0_20px_45px_-30px_rgba(82,43,44,.4)] sm:px-8">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full border border-rose-200 bg-[#fffaf6] text-rose-800 shadow-[0_0_0_7px_#fbf8f5]"><Icon aria-hidden="true" size={21} strokeWidth={1.65} /></span>
              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-800">Step {number}</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">{title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-stone-600">{description}</p>
            </article>
          </Reveal>)}
        </div>
        <Link href="/services" className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#5b303a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#48262e]">Start exploring<ArrowRight aria-hidden="true" size={16} className="transition-transform group-hover:translate-x-1" /></Link>
      </section>
    </Reveal>
  );
}
