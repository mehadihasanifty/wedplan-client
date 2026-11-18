"use client";

import { CalendarCheck, Check, Heart, Sparkles } from "lucide-react";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { WeddingIllustration } from "@/components/home/WeddingIllustration";

export function HeroArtwork() {
  const reduceMotion = useReducedMotion();
  const artworkRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: artworkRef, offset: ["start end", "end start"] });
  const artworkDepth = useSpring(useTransform(scrollYProgress, [0, 1], [20, -20]), { stiffness: 70, damping: 24, mass: 0.35 });

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[520px] px-2 pb-5 pt-2 sm:px-4 lg:max-w-none lg:px-0"
      ref={artworkRef}
      initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.85, delay: reduceMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div aria-hidden="true" className="absolute inset-[7%] rounded-full border border-rose-200/70" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 90, repeat: Infinity, ease: "linear" }} />
      <div aria-hidden="true" className="absolute inset-[13%] rounded-full bg-[radial-gradient(circle,rgba(198,125,118,.19),transparent_68%)] blur-2xl" />
      <motion.div aria-hidden="true" className="absolute -right-1 top-[18%] z-20 flex size-12 items-center justify-center rounded-2xl border border-white/70 bg-white/80 text-rose-700 shadow-lg shadow-rose-950/10 backdrop-blur sm:-right-4" animate={reduceMotion ? undefined : { y: [0, -7, 0], rotate: [0, 3, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}><Sparkles size={19} strokeWidth={1.6} /></motion.div>
      <motion.div style={{ y: reduceMotion ? 0 : artworkDepth }} className="relative z-10 overflow-hidden rounded-[1.75rem] border-[5px] border-white/80 bg-[#f7ece5] shadow-[0_32px_90px_-48px_rgba(91,48,54,0.56)] ring-1 ring-rose-950/[.06]"><WeddingIllustration /></motion.div>
      <motion.div className="absolute -left-1 top-[17%] z-20 hidden max-w-[220px] items-center gap-3 rounded-2xl border border-white/85 bg-white/90 px-3.5 py-3 shadow-xl shadow-rose-950/10 backdrop-blur-md sm:flex sm:-left-7" animate={reduceMotion ? undefined : { y: [0, 5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}>
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-700"><Heart aria-hidden="true" size={17} /></span>
        <span><span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">The right people</span><span className="mt-0.5 block font-serif text-base text-[#49342f]">Your day, your way.</span></span>
      </motion.div>
      <motion.div className="absolute -bottom-1 right-1 z-20 flex items-center gap-3 rounded-2xl border border-white/85 bg-white/95 px-4 py-3 shadow-xl shadow-rose-950/10 backdrop-blur-md sm:-right-5 sm:px-5" animate={reduceMotion ? undefined : { y: [0, -6, 0] }} transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }} whileHover={reduceMotion ? undefined : { y: -4, scale: 1.02 }}>
        <span className="flex size-10 items-center justify-center rounded-xl bg-rose-100 text-rose-800  "><CalendarCheck size={18} /></span>
        <span><span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Your celebration</span><span className="mt-0.5 block text-sm font-semibold">Starts with a lovely idea</span></span>
        <span className="ml-1 grid size-7 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Check aria-hidden="true" size={14} /></span>
      </motion.div>
    </motion.div>
  );
}

