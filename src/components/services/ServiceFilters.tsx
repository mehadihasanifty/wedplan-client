"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

const categories = ["Photography & Videography", "Wedding Venues", "Decoration & Florist", "Catering Services", "Makeup & Styling", "Wedding Fashion"];

export type ServiceFilterValues = { search: string; category: string; location: string; sort: string };

export function ServiceFilters({ values, onChange, locations, onReset }: { values: ServiceFilterValues; onChange: (values: ServiceFilterValues) => void; locations: string[]; onReset: () => void }) {
  const inputClass = "h-12 w-full rounded-xl border border-[#eadfd5] bg-white px-3.5 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100";
  return (
    <div className="rounded-[1.6rem] border border-[#eee1d7] bg-white/90 p-4 shadow-[0_18px_50px_-38px_rgba(82,43,44,.38)] sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3"><p className="flex items-center gap-2 text-sm font-semibold text-stone-800"><SlidersHorizontal aria-hidden="true" size={16} className="text-rose-800" />Find your fit</p>{(values.search || values.category || values.location || values.sort) && <button type="button" onClick={onReset} className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-rose-800 transition hover:bg-rose-50"><X size={14} />Clear filters</button>}</div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_0.9fr]">
        <label className="relative block"><span className="sr-only">Search services by name</span><Search aria-hidden="true" size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" /><input value={values.search} onChange={event => onChange({ ...values, search: event.target.value })} className={`${inputClass} pl-11`} placeholder="Search by service name" /></label>
        <label><span className="sr-only">Filter by category</span><select value={values.category} onChange={event => onChange({ ...values, category: event.target.value })} className={inputClass}><option value="">All categories</option>{categories.map(category => <option key={category} value={category}>{category}</option>)}</select></label>
        <label><span className="sr-only">Filter by location</span><select value={values.location} onChange={event => onChange({ ...values, location: event.target.value })} className={inputClass}><option value="">All locations</option>{locations.map(location => <option key={location} value={location}>{location}</option>)}</select></label>
        <label><span className="sr-only">Sort by price</span><select value={values.sort} onChange={event => onChange({ ...values, sort: event.target.value })} className={inputClass}><option value="">Featured first</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label>
      </div>
    </div>
  );
}
