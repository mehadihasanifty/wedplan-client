import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  Heart,
  Mail,
  Phone,
  Play,
  UsersRound,
} from "lucide-react";

const COPYRIGHT_YEAR = 2026;

// Replace these editable placeholders with WedPlan's real contact details and profiles.
const contact = {
  email: "hello@yourdomain.com",
  phone: "+1 (555) 010-1234",
};

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/your-wedplan-handle/",
    icon: Camera,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/your-wedplan-page/",
    icon: UsersRound,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@your-wedplan-channel",
    icon: Play,
  },
];

const navigation = [
  { label: "Home", href: "/" },
  { label: "Browse services", href: "/services" },
  { label: "Sign in", href: "/signin" },
  { label: "Create an account", href: "/signup" },
];

export function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-rose-100 bg-[#f8f4ef] text-stone-900 sm:mt-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-40 size-[28rem] rounded-full bg-rose-200/35 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 size-[30rem] rounded-full bg-amber-200/35 blur-[110px]"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <section
          aria-labelledby="footer-cta-title"
          className="relative isolate -mt-8 overflow-hidden rounded-[2rem] border border-rose-100 bg-gradient-to-br from-white via-[#fffdfa] to-[#f9ece6] px-6 py-8 text-[#342321] shadow-[0_24px_70px_-38px_rgba(91,48,54,0.24)] sm:px-10 sm:py-10 lg:-mt-10 lg:grid lg:grid-cols-[1fr_0.7fr] lg:items-center lg:px-14 lg:py-12"
        >
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-24 -z-10 size-72 rounded-full bg-rose-200/60 blur-3xl"
          />
          <div className="relative z-10 max-w-xl">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-800">
              <span className="size-1.5 rounded-full bg-rose-700" />
              Your next chapter starts here
            </p>
            <h2
              id="footer-cta-title"
              className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl lg:text-[2.75rem]"
            >
              Let the lovely details{" "}
              <span className="font-serif font-normal italic text-rose-800">
                come together.
              </span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-stone-600 sm:text-base sm:leading-7">
              Find the wedding professionals who understand your vision, then
              bring your plans to life one thoughtful choice at a time.
            </p>
            <Link
              href="/services"
              className="group mt-6 inline-flex items-center gap-3 rounded-full bg-[#562d36] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-950/15 transition duration-200 hover:-translate-y-0.5 hover:bg-[#43232b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-700 focus-visible:ring-offset-2"
            >
              Explore wedding services
              <span className="flex size-7 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5">
                <ArrowRight aria-hidden="true" size={15} />
              </span>
            </Link>
          </div>

          <div
            aria-hidden="true"
            className="relative mx-auto mt-7 hidden h-48 w-full max-w-[360px] lg:mt-0 lg:block"
          >
            <div className="absolute inset-x-9 bottom-0 top-1 rounded-t-[12rem] border border-rose-300/70 bg-gradient-to-b from-white/80 to-rose-100/50" />
            <div className="absolute inset-x-16 bottom-0 top-8 rounded-t-[10rem] border border-rose-300/50" />
            <div className="absolute left-1/2 top-1/2 flex size-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/90 bg-white/80 text-rose-800 shadow-[0_12px_35px_-16px_rgba(96,44,53,0.24)] backdrop-blur-sm">
              <Heart size={31} strokeWidth={1.25} />
            </div>
            <svg
              viewBox="0 0 360 190"
              className="absolute inset-0 h-full w-full"
              fill="none"
            >
              <path
                d="M15 180c20-48 28-93 30-144m-2 104c-16-13-25-26-28-43m33 19c14-11 22-23 27-39m243 103c-17-46-24-90-25-141m2 105c15-13 23-26 26-42m-32 18c-14-11-22-23-26-39"
                stroke="#8b9272"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <g fill="#c8817d">
                <circle cx="26" cy="98" r="7" />
                <circle cx="65" cy="77" r="6" />
                <circle cx="42" cy="45" r="5" />
                <circle cx="333" cy="96" r="7" />
                <circle cx="296" cy="75" r="6" />
                <circle cx="318" cy="43" r="5" />
              </g>
              <g fill="#d9b29b">
                <circle cx="26" cy="98" r="2" />
                <circle cx="65" cy="77" r="2" />
                <circle cx="42" cy="45" r="1.7" />
                <circle cx="333" cy="96" r="2" />
                <circle cx="296" cy="75" r="2" />
                <circle cx="318" cy="43" r="1.7" />
              </g>
              <path
                d="m180 16 2.5 7.5L190 26l-7.5 2.5L180 36l-2.5-7.5L170 26l7.5-2.5L180 16Z"
                fill="#b67769"
                opacity=".65"
              />
              <circle cx="112" cy="37" r="2.5" fill="#c78e7d" />
              <circle cx="249" cy="148" r="2.5" fill="#c78e7d" />
            </svg>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/70 bg-white/75 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-900 shadow-sm backdrop-blur">
              A celebration, beautifully yours
            </div>
          </div>
        </section>

        <div className="grid gap-10 pb-10 pt-14 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_1fr_0.85fr] lg:gap-12 lg:pb-14 lg:pt-16">
          <section aria-labelledby="footer-brand" className="max-w-sm">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8f4ef]"
            >
              <span className="flex size-11 items-center justify-center rounded-2xl border border-rose-200/80 bg-white text-rose-800 shadow-sm transition duration-200 group-hover:rotate-[-6deg] group-hover:bg-rose-50">
                <Heart aria-hidden="true" size={19} strokeWidth={1.8} />
              </span>
              <span
                id="footer-brand"
                className="text-xl font-semibold tracking-tight text-stone-900"
              >
                Wed<span className="text-rose-800">Plan</span>
              </span>
            </Link>
            <p className="mt-5 text-sm leading-7 text-stone-600">
              A thoughtful place to discover wedding professionals, shape your
              vision, and bring every meaningful detail together.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-rose-800">
              <Heart aria-hidden="true" size={13} /> Made for your forever
            </p>
          </section>

          <section aria-labelledby="footer-navigation">
            <h2
              id="footer-navigation"
              className="text-xs font-semibold uppercase tracking-[0.17em] text-stone-900"
            >
              Explore
            </h2>
            <ul className="mt-5 space-y-3.5">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-stone-600 transition-colors hover:text-rose-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                  >
                    {item.label}
                    <ArrowUpRight
                      aria-hidden="true"
                      size={12}
                      className="opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-70"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="footer-contact">
            <h2
              id="footer-contact"
              className="text-xs font-semibold uppercase tracking-[0.17em] text-stone-900"
            >
              A note to us
            </h2>
            <p className="mt-5 max-w-xs text-sm leading-6 text-stone-600">
              Need a hand finding the right fit? Our team is happy to help you
              get started.
            </p>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-3 text-sm text-stone-700 transition hover:text-rose-800"
                >
                  <Mail
                    aria-hidden="true"
                    size={15}
                    className="text-rose-700"
                  />
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
                  className="inline-flex items-center gap-3 text-sm text-stone-700 transition hover:text-rose-800"
                >
                  <Phone
                    aria-hidden="true"
                    size={15}
                    className="text-rose-700"
                  />
                  {contact.phone}
                </a>
              </li>
            </ul>
          </section>

          <section aria-labelledby="footer-social">
            <h2
              id="footer-social"
              className="text-xs font-semibold uppercase tracking-[0.17em] text-stone-900"
            >
              Stay inspired
            </h2>
            <p className="mt-5 max-w-xs text-sm leading-6 text-stone-600">
              Follow along for thoughtful ideas and moments worth remembering.
            </p>
            <div className="mt-5 flex gap-2.5">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`WedPlan on ${label} (placeholder link)`}
                  className="group flex size-10 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-800 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                >
                  <Icon aria-hidden="true" size={16} />
                </a>
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-3 border-t border-rose-200/70 py-5 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {COPYRIGHT_YEAR} WedPlan. All rights reserved.</p>
          <p className="inline-flex items-center gap-1.5">
            Thoughtfully made for your next chapter{" "}
            <Heart aria-hidden="true" size={12} className="text-rose-700" />
          </p>
        </div>
      </div>
    </footer>
  );
}
