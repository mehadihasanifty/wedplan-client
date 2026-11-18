import Link from "next/link";
import { ArrowRight, CalendarDays, Search, Send } from "lucide-react";
import { Reveal } from "@/components/home/Reveal";

const steps = [
  { number: "01", icon: Search, title: "Explore what you love", description: "Browse approved services and filter by category, location, and budget." },
  { number: "02", icon: CalendarDays, title: "Find your people", description: "Review service details and choose the vendors that fit your plans." },
  { number: "03", icon: Send, title: "Request your date", description: "Share your event details and follow your booking request in your dashboard." },
];

export function HowItWorks() {
  return (
    <Reveal>
      <section id="how-it-works" aria-labelledby="how-title" className="py-12 sm:py-16">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700 dark:text-rose-300">Three simple steps</p><h2 id="how-title" className="mt-2 text-3xl font-semibold tracking-tight">From ideas to “I do”</h2></div><p className="max-w-md text-sm leading-6 text-muted-foreground">Keep the planning moving, one thoughtful choice at a time.</p></div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map(({ number, icon: Icon, title, description }, index) => <Reveal key={number} delay={index * 0.08}><article className="relative h-full rounded-2xl border border-border/70 bg-card p-6 sm:p-7"><div className="flex items-center justify-between"><span className="text-xs font-semibold tracking-[0.16em] text-rose-700 dark:text-rose-300">STEP {number}</span><span className="flex size-11 items-center justify-center rounded-full bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200"><Icon aria-hidden="true" size={20} strokeWidth={1.7} /></span></div><h3 className="mt-6 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></article></Reveal>)}
        </div>
        <Link href="/services" className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold text-rose-800 hover:text-rose-950 dark:text-rose-200 dark:hover:text-rose-100">Start exploring<ArrowRight aria-hidden="true" size={16} className="transition-transform group-hover:translate-x-1" /></Link>
      </section>
    </Reveal>
  );
}
