"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeDollarSign,
  CalendarDays,
  ChartNoAxesCombined,
  CircleUserRound,
  CreditCard,
  LayoutDashboard,
  Plus,
  Settings2,
  Sparkles,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/types";

const navigation: Record<
  UserRole,
  { href: string; label: string; icon: LucideIcon }[]
> = {
  vendor: [
    { href: "/dashboard/vendor", label: "Overview", icon: LayoutDashboard },
    {
      href: "/dashboard/vendor/my-services",
      label: "My services",
      icon: Store,
    },
    { href: "/dashboard/vendor/add-service", label: "Add service", icon: Plus },
    {
      href: "/dashboard/vendor/booking-requests",
      label: "Booking requests",
      icon: CalendarDays,
    },
    {
      href: "/dashboard/vendor/subscription",
      label: "Subscription",
      icon: CreditCard,
    },
    {
      href: "/dashboard/vendor/profile-settings",
      label: "Profile settings",
      icon: Settings2,
    },
  ],
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
    {
      href: "/dashboard/customer/my-bookings",
      label: "My bookings",
      icon: CalendarDays,
    },
    {
      href: "/dashboard/customer/profile-settings",
      label: "Profile settings",
      icon: Settings2,
    },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/services", label: "Services", icon: Store },
    {
      href: "/dashboard/admin/transactions",
      label: "Transactions",
      icon: BadgeDollarSign,
    },
  ],
};

export function DashboardSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  return (
    <aside className="flex h-full flex-col border-b border-[#eadfd5] bg-[#fffdfa] p-4 sm:p-5 md:min-h-[calc(100vh-72px)] md:border-b-0 md:border-r">
      <div className="mb-5 flex items-center gap-3 rounded-2xl bg-[#f7f0eb] px-3.5 py-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-white text-rose-800 shadow-sm">
          <CircleUserRound size={19} />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
            Your workspace
          </p>
          <p className="mt-0.5 text-sm font-semibold capitalize text-stone-900">
            {role} portal
          </p>
        </div>
      </div>
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.17em] text-stone-400">
        Manage
      </p>
      <nav
        aria-label={`${role} dashboard`}
        className="flex gap-1.5 overflow-x-auto md:flex-col md:overflow-visible"
      >
        {navigation[role].map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard/vendor" ||
            href === "/dashboard/customer" ||
            href === "/dashboard/admin"
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`group inline-flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${active ? "bg-rose-800 text-white shadow-md shadow-rose-950/10" : "text-stone-600 hover:bg-rose-50 hover:text-rose-900"}`}
            >
              <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
              <span>{label}</span>
              {active && (
                <span
                  aria-hidden="true"
                  className="ml-auto hidden size-1.5 rounded-full bg-rose-200 md:block"
                />
              )}
            </Link>
          );
        })}
      </nav>
      {role === "vendor" && (
        <div className="mt-auto hidden rounded-2xl border border-rose-100 bg-[linear-gradient(145deg,#fff9f5,#f5e9e1)] p-4 md:block">
          <span className="flex size-9 items-center justify-center rounded-xl bg-white text-rose-800 shadow-sm">
            <Sparkles size={17} />
          </span>
          <p className="mt-3 text-sm font-semibold text-stone-900">
            Grow with WedPlan
          </p>
          <p className="mt-1 text-xs leading-5 text-stone-600">
            Stand out to couples with unlimited listings and a Premium badge.
          </p>
          <Link
            href="/dashboard/vendor/subscription"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-rose-800 hover:text-rose-950"
          >
            Explore Premium
            <ChartNoAxesCombined size={14} />
          </Link>
        </div>
      )}
    </aside>
  );
}
