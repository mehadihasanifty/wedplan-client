import Link from "next/link";
import { Camera, Heart, Mail, MapPin, Phone, Play, UsersRound } from "lucide-react";

// Replace these editable placeholders with WedPlan's real contact details and profiles.
const contact = {
  email: "hello@yourdomain.com",
  phone: "+1 (555) 010-1234",
};

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/your-wedplan-handle/", icon: Camera },
  { label: "Facebook", href: "https://www.facebook.com/your-wedplan-page/", icon: UsersRound },
  { label: "YouTube", href: "https://www.youtube.com/@your-wedplan-channel", icon: Play },
];

const navigation = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
  { label: "Sign In", href: "/login" },
  { label: "Create an Account", href: "/register" },
];

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-rose-950/10 bg-[#24151d] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-36 size-80 rounded-full bg-rose-400/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 pb-6 pt-14 sm:px-6 lg:px-8 lg:pt-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_1fr_0.9fr] lg:gap-12">
          <section aria-labelledby="footer-brand" className="max-w-sm">
            <Link href="/" className="group inline-flex items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#24151d]">
              <span className="flex size-10 items-center justify-center rounded-full bg-rose-300/15 text-rose-200 transition-transform group-hover:scale-105"><Heart aria-hidden="true" size={18} /></span>
              <span id="footer-brand" className="text-xl font-semibold tracking-tight">Wed<span className="text-rose-300">Plan</span></span>
            </Link>
            <p className="mt-5 text-sm leading-7 text-rose-50/70">A little more joy in every wedding decision. Find trusted local professionals and bring your celebration together with confidence.</p>
            <p className="mt-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-rose-200/80"><Heart aria-hidden="true" size={13} /> Made for your forever</p>
          </section>

          <section aria-labelledby="footer-navigation">
            <h2 id="footer-navigation" className="text-sm font-semibold tracking-wide">Explore WedPlan</h2>
            <ul className="mt-5 space-y-3.5">
              {navigation.map(item => <li key={item.href}><Link href={item.href} className="text-sm text-rose-50/70 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300">{item.label}</Link></li>)}
            </ul>
          </section>

          <section aria-labelledby="footer-contact">
            <h2 id="footer-contact" className="text-sm font-semibold tracking-wide">Get in touch</h2>
            <p className="mt-5 text-sm leading-6 text-rose-50/65">Questions about finding a vendor or listing your services? We’d love to hear from you.</p>
            <ul className="mt-4 space-y-3.5">
              <li><a href={`mailto:${contact.email}`} className="group inline-flex items-center gap-3 text-sm text-rose-50/80 transition-colors hover:text-white"><Mail aria-hidden="true" size={16} className="text-rose-300" />{contact.email}</a></li>
              <li><a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`} className="group inline-flex items-center gap-3 text-sm text-rose-50/80 transition-colors hover:text-white"><Phone aria-hidden="true" size={16} className="text-rose-300" />{contact.phone}</a></li>
              <li className="inline-flex items-center gap-3 text-sm text-rose-50/65"><MapPin aria-hidden="true" size={16} className="text-rose-300" />Here for couples everywhere</li>
            </ul>
          </section>

          <section aria-labelledby="footer-social">
            <h2 id="footer-social" className="text-sm font-semibold tracking-wide">Follow the inspiration</h2>
            <p className="mt-5 text-sm leading-6 text-rose-50/65">Ideas, real celebrations, and lovely details for the days ahead.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={`WedPlan on ${label} (placeholder link)`} className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-rose-100 transition hover:-translate-y-0.5 hover:border-rose-200/50 hover:bg-rose-200/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"><Icon aria-hidden="true" size={17} /></a>)}
            </div>
          </section>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-rose-50/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} WedPlan. All rights reserved.</p>
          <p>Thoughtfully made for your next chapter <Heart aria-hidden="true" size={12} className="ml-1 inline text-rose-300" /></p>
        </div>
      </div>
    </footer>
  );
}
