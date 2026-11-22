"use client";

import { BadgeCheck, HeartHandshake, Search } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/home/Reveal";

const benefits = [
  {
    icon: BadgeCheck,
    title: "Reviewed before they’re listed",
    description:
      "Services are reviewed by the WedPlan team before they appear for couples to browse.",
  },
  {
    icon: Search,
    title: "A clearer way to compare",
    description:
      "Explore service details, pricing, and locations together as you find the right fit.",
  },
  {
    icon: HeartHandshake,
    title: "One place to keep plans moving",
    description:
      "Send booking requests and follow their status from your own customer dashboard.",
  },
];

export function WhyChooseUs() {
  const reduceMotion = useReducedMotion();
  return (
    <Reveal>
      <section
        aria-labelledby="why-title"
        className="relative isolate overflow-hidden rounded-[2rem] border border-[#eee1d7] bg-[linear-gradient(135deg,#f6eee8_0%,#fbf7f2_54%,#f3e8df_100%)] px-6 py-12 sm:px-10 sm:py-16 lg:px-14"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-14 -top-24 -z-10 size-72 rounded-full bg-rose-200/50 blur-3xl"
        />
        <div className="grid gap-9 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
              A calmer way to plan
            </p>
            <h2
              id="why-title"
              className="mt-3 max-w-lg text-3xl font-semibold tracking-[-0.035em] sm:text-4xl"
            >
              A little more confidence in every wedding decision.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-stone-600">
              Your celebration is personal. WedPlan helps you find services,
              understand your options, and keep track of booking requests as
              your plans come together.
            </p>
            <div className="mt-7 flex items-center gap-3 text-xs font-medium text-stone-500">
              <span aria-hidden="true" className="h-px w-9 bg-rose-300" />
              Thoughtfully chosen, easy to compare
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }, index) => (
              <motion.article
                key={title}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.55,
                  delay: reduceMotion ? 0 : index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={reduceMotion ? undefined : { y: -4 }}
                className="group rounded-2xl border border-white/90 bg-white/80 p-5 shadow-[0_10px_28px_-22px_rgba(82,43,44,.42)] transition-shadow hover:shadow-[0_18px_35px_-24px_rgba(82,43,44,.48)]"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-rose-100 text-rose-800 transition-colors group-hover:bg-rose-800 group-hover:text-white">
                  <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 text-base font-semibold leading-snug">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-stone-600">
                  {description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}
