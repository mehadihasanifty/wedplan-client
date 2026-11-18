import Link from "next/link";
import { ArrowUpRight, Camera, Flower2, Landmark, Shirt, Sparkles, Utensils } from "lucide-react";
import { Reveal } from "@/components/home/Reveal";

const categories = [
  { name: "Photography & Videography", note: "Keep every moment close", icon: Camera, tone: "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200" },
  { name: "Wedding Venues", note: "Find a place that feels like you", icon: Landmark, tone: "bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200" },
  { name: "Decoration & Florist", note: "Set the scene with every detail", icon: Flower2, tone: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200" },
  { name: "Catering Services", note: "Make room for something delicious", icon: Utensils, tone: "bg-orange-100 text-orange-900 dark:bg-orange-950/50 dark:text-orange-200" },
  { name: "Makeup & Styling", note: "Feel like your most radiant self", icon: Sparkles, tone: "bg-violet-100 text-violet-900 dark:bg-violet-950/50 dark:text-violet-200" },
  { name: "Wedding Fashion", note: "Find the look that feels like you", icon: Shirt, tone: "bg-sky-100 text-sky-900 dark:bg-sky-950/50 dark:text-sky-200" },
];

export function Categories() {
  return (
    <Reveal>
      <section aria-labelledby="categories-title" className="py-12 sm:py-16">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700 dark:text-rose-300">Start with what matters</p><h2 id="categories-title" className="mt-2 text-3xl font-semibold tracking-tight">Explore by category</h2></div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">Browse the details that make a celebration feel unmistakably yours.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ name, note, icon: Icon, tone }) => <Link key={name} href={`/services?category=${encodeURIComponent(name)}`} className="group flex min-h-28 items-center gap-4 rounded-2xl border border-border/70 bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-950/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400">
            <span className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${tone}`}><Icon aria-hidden="true" size={21} strokeWidth={1.7} /></span>
            <span className="min-w-0 flex-1"><span className="block font-semibold leading-snug">{name}</span><span className="mt-1 block text-sm text-muted-foreground">{note}</span></span>
            <ArrowUpRight aria-hidden="true" size={17} className="shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-rose-700" />
          </Link>)}
        </div>
      </section>
    </Reveal>
  );
}
