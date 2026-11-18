"use client";

import { CalendarCheck, Heart, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { WeddingIllustration } from "@/components/home/WeddingIllustration";

export function HeroArtwork() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[520px] lg:max-w-none"
      initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.85, delay: reduceMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div aria-hidden="true" className="absolute inset-[7%] rounded-full border border-rose-200/70 dark:border-rose-100/10" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 90, repeat: Infinity, ease: "linear" }} />
      <motion.div aria-hidden="true" className="absolute -right-2 top-[18%] z-20 flex size-12 items-center justify-center rounded-2xl border border-white/70 bg-white/80 text-rose-700 shadow-lg shadow-rose-950/10 backdrop-blur dark:border-white/10 dark:bg-stone-900/80 dark:text-rose-200 sm:-right-4" animate={reduceMotion ? undefined : { y: [0, -7, 0], rotate: [0, 3, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}><Sparkles size={19} strokeWidth={1.6} /></motion.div>
      <div className="relative z-10 overflow-hidden rounded-[1.75rem] border border-white/70 shadow-[0_32px_90px_-48px_rgba(91,48,54,0.56)] dark:border-white/10"><WeddingIllustration /></div>
      <motion.div className="absolute -bottom-5 left-3 z-20 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-xl shadow-rose-950/10 backdrop-blur-md dark:border-white/10 dark:bg-stone-900/90 sm:-left-5 sm:px-5" animate={reduceMotion ? undefined : { y: [0, -6, 0] }} transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }} whileHover={reduceMotion ? undefined : { y: -4, scale: 1.02 }}>
        <span className="flex size-10 items-center justify-center rounded-xl bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200"><CalendarCheck size={18} /></span>
        <span><span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Your celebration</span><span className="mt-0.5 block text-sm font-semibold">Starts with a lovely idea</span></span>
        <Heart aria-hidden="true" size={16} className="ml-1 text-rose-500" />
      </motion.div>
    </motion.div>
  );
}
