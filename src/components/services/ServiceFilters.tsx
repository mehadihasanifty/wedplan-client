"use client";

import { Camera, Flower2, Landmark, Search, Shirt, SlidersHorizontal, Sparkles, Utensils, X } from "lucide-react";

const categories = [
  { name: "Photography & Videography", icon: Camera },
  { name: "Wedding Venues", icon: Landmark },
  { name: "Decoration & Florist", icon: Flower2 },
  { name: "Catering Services", icon: Utensils },
  { name: "Makeup & Styling", icon: Sparkles },
  { name: "Wedding Fashion", icon: Shirt },
];

export type ServiceFilterValues = { search: string; category: string; location: string; sort: string };

export function ServiceFilters({ values, onChange, locations, onReset }: { values: ServiceFilterValues; onChange: (values: ServiceFilterValues) => void; locations: string[]; onReset: () => void }) {
  const inputClass = "h-[50px] w-full rounded-xl border border-[#e9ded6] bg-[#fffefd] px-3.5 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 hover:border-rose-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-100/80";
  return (
    <section aria-label="Search and filter services" className="overflow-hidden rounded-[1.7rem] border border-[#ecdfd6] bg-white shadow-[0_20px_55px_-42px_rgba(82,43,44,.42)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0e8e2] bg-[linear-gradient(90deg,#fffdfa,#fbf6f1)] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-rose-100/80 text-rose-800"><SlidersHorizontal aria-hidden="true" size={16} /></span><div><h2 className="text-sm font-semibold text-stone-900">Find your fit</h2><p className="mt-0.5 text-xs text-stone-500">A few details can make all the difference.</p></div></div>
        {(values.search || values.category || values.location || values.sort) && <button type="button" onClick={onReset} className="inline-flex items-center gap-1.5 rounded-full border border-rose-100 bg-white px-3 py-2 text-xs font-semibold text-rose-800 transition hover:border-rose-200 hover:bg-rose-50"><X size={13} />Clear filters</button>}
      </div>
      <div className="p-4 sm:p-5 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.45fr_1fr_1fr]">
          <label className="relative block"><span className="sr-only">Search services by name</span><Search aria-hidden="true" size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-700/70" /><input value={values.search} onChange={event => onChange({ ...values, search: event.target.value })} className={`${inputClass} pl-11`} placeholder="What are you looking for?" /></label>
          <label><span className="sr-only">Filter by location</span><select value={values.location} onChange={event => onChange({ ...values, location: event.target.value })} className={inputClass}><option value="">Everywhere</option>{locations.map(location => <option key={location} value={location}>{location}</option>)}</select></label>
          <label><span className="sr-only">Sort by price</span><select value={values.sort} onChange={event => onChange({ ...values, sort: event.target.value })} className={inputClass}><option value="">Sort: featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label>
        </div>
        <div className="mt-5"><p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">Explore a category</p><div className="flex gap-2 overflow-x-auto pb-1.5 sm:flex-wrap sm:overflow-visible">{categories.map(({ name, icon: Icon }) => { const active = values.category === name; return <button key={name} type="button" aria-pressed={active} onClick={() => onChange({ ...values, category: active ? "" : name })} className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2.5 text-xs font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 ${active ? "border-rose-800 bg-rose-800 text-white shadow-md shadow-rose-950/10" : "border-[#eee4dd] bg-[#fffdfa] text-stone-600 hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-900"}`}><Icon aria-hidden="true" size={14} strokeWidth={1.8} />{name}</button>; })}</div></div>
      </div>
    </section>
  );
}
