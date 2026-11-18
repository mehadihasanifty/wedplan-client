import { BadgeCheck, HeartHandshake, Search } from "lucide-react";
import { Reveal } from "@/components/home/Reveal";

const benefits = [
  { icon: BadgeCheck, title: "Reviewed before they’re listed", description: "Services are reviewed by the WedPlan team before they appear for couples to browse." },
  { icon: Search, title: "A clearer way to compare", description: "Explore service details, pricing, and locations together as you find the right fit." },
  { icon: HeartHandshake, title: "One place to keep plans moving", description: "Send booking requests and follow their status from your own customer dashboard." },
];

export function WhyChooseUs() {
  return (
    <Reveal>
      <section aria-labelledby="why-title" className="relative isolate overflow-hidden rounded-[2rem] bg-[#f4eee8] px-6 py-12 dark:bg-[#211a1b] sm:px-10 sm:py-16 lg:px-14">
        <div aria-hidden="true" className="absolute -right-14 -top-24 -z-10 size-72 rounded-full bg-rose-200/50 blur-3xl dark:bg-rose-600/10" />
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700 dark:text-rose-300">A calmer way to plan</p><h2 id="why-title" className="mt-3 max-w-lg text-3xl font-semibold tracking-tight sm:text-4xl">A little more confidence in every wedding decision.</h2><p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">Your celebration is personal. WedPlan helps you find services, understand your options, and keep track of booking requests as your plans come together.</p></div>
          <div className="grid gap-3 sm:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }) => <article key={title} className="rounded-2xl border border-white/80 bg-white/75 p-5 shadow-sm shadow-rose-950/5 dark:border-white/10 dark:bg-white/5"><span className="flex size-10 items-center justify-center rounded-xl bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200"><Icon aria-hidden="true" size={19} strokeWidth={1.8} /></span><h3 className="mt-4 text-sm font-semibold leading-snug">{title}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{description}</p></article>)}
          </div>
        </div>
      </section>
    </Reveal>
  );
}
