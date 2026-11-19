"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CalendarDays,
  CircleDollarSign,
  ClipboardList,
  Plus,
  Store,
  type LucideIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getVendorBookings } from "@/services/booking-api";
import { getServices } from "@/services/service-api";
import type { Booking, Service } from "@/types";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import {
  belongsToVendor,
  formatCurrency,
} from "@/components/dashboard/vendor/constants";

type VendorUser = {
  id?: string;
  _id?: string;
  name?: string;
  businessName?: string;
  subscriptionPlan?: string;
};

export function VendorOverview() {
  const { data: session } = authClient.useSession();
  const user = session?.user as VendorUser | undefined;
  const vendorId = user?.id ?? user?._id;
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!vendorId) return;
    let active = true;
    Promise.all([
      getServices({ vendorId, limit: 100 }),
      getVendorBookings(vendorId),
    ])
      .then(([allServices, allBookings]) => {
        if (active) {
          setServices(
            allServices.filter((item) => belongsToVendor(item, vendorId)),
          );
          setBookings(allBookings);
          setError(false);
        }
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [vendorId]);

  const activeServices = services.filter(
    (item) => item.status === "approved" && item.isActive === true,
  ).length;
  const pendingBookings = bookings.filter((item) => item.status === "pending");
  const acceptedBookings = bookings.filter(
    (item) => item.status === "accepted",
  ).length;
  const planName = user?.subscriptionPlan || "Free";
  const premium = /premium/i.test(planName);

  return (
    <div className="mx-auto max-w-7xl">
      <header className="relative mb-7 overflow-hidden rounded-[1.8rem] border border-[#e9d9cf] bg-[linear-gradient(120deg,#fffaf6,#f7eee8_58%,#f0e3dc)] px-5 py-7 shadow-[0_24px_65px_-52px_rgba(82,43,44,.42)] sm:px-8 sm:py-9">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-24 size-72 rounded-full border border-rose-900/[.07]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-12 top-8 size-48 rounded-full bg-rose-200/30 blur-3xl"
        />
        <div className="relative flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-rose-800">
              Vendor workspace
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#352321] sm:text-4xl">
              Good to see you,{" "}
              {user?.businessName || user?.name?.split(" ")[0] || "vendor"}.
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">
              Here’s how your services and booking requests are looking today.
            </p>
          </div>
          <Link
            href="/dashboard/vendor/add-service"
            className="inline-flex items-center gap-2 rounded-full bg-rose-800 px-4 py-3 text-xs font-semibold text-white shadow-md shadow-rose-950/10 transition hover:-translate-y-0.5 hover:bg-rose-900"
          >
            <Plus size={15} />
            Add a service
          </Link>
        </div>
      </header>

      {loading ? (
        <Loading label="Loading your vendor overview…" />
      ) : error ? (
        <ErrorState message="We couldn’t load your dashboard information. Please refresh and try again." />
      ) : (
        <>
          <section
            aria-label="Vendor statistics"
            className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5"
          >
            <MetricCard
              label="Total services"
              value={services.length}
              note="All submitted listings"
              icon={Store}
              tone="rose"
            />
            <MetricCard
              label="Active services"
              value={activeServices}
              note="Approved and available"
              icon={BadgeCheck}
              tone="green"
            />
            <MetricCard
              label="Pending requests"
              value={pendingBookings.length}
              note="Waiting for your reply"
              icon={CalendarClock}
              tone="amber"
            />
            <MetricCard
              label="Accepted bookings"
              value={acceptedBookings}
              note="Confirmed celebrations"
              icon={CalendarDays}
              tone="violet"
            />
            <MetricCard
              label="Current plan"
              value={premium ? "Premium" : "Free"}
              note={
                premium
                  ? "Unlimited listings"
                  : `${activeServices} of 3 active services`
              }
              icon={CircleDollarSign}
              tone="rose"
            />
          </section>

          <div className="mt-7 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-[1.6rem] border border-[#eee3dc] bg-white p-5 shadow-[0_16px_42px_-35px_rgba(82,43,44,.36)] sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-rose-800">
                    Needs your attention
                  </p>
                  <h2 className="mt-1 text-lg font-semibold tracking-tight text-stone-900">
                    Recent booking requests
                  </h2>
                </div>
                <Link
                  href="/dashboard/vendor/booking-requests"
                  className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold text-rose-800 transition hover:bg-rose-50"
                >
                  View all
                  <ArrowRight size={14} />
                </Link>
              </div>
              {pendingBookings.length ? (
                <div className="mt-4 divide-y divide-[#f0e8e2]">
                  {pendingBookings.slice(0, 4).map((booking, index) => (
                    <div
                      key={
                        booking.id ??
                        booking._id ??
                        `${booking.customerId}-${index}`
                      }
                      className="flex flex-wrap items-center justify-between gap-3 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-stone-800">
                          {booking.customer?.name || "Customer request"}
                          <span className="font-normal text-stone-500">
                            {" "}
                            ·{" "}
                            {booking.service?.serviceName || "Service booking"}
                          </span>
                        </p>
                        <p className="mt-1 text-xs text-stone-500">
                          {new Date(booking.eventDate).toLocaleDateString(
                            "en",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}{" "}
                          · {booking.eventLocation}
                        </p>
                      </div>
                      <span className="rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-semibold text-amber-800">
                        Pending
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-[#eadfd5] bg-[#fffdfa] px-4 py-8 text-center">
                  <CalendarDays
                    aria-hidden="true"
                    size={22}
                    className="mx-auto text-rose-700/70"
                  />
                  <p className="mt-2 text-sm font-semibold text-stone-800">
                    You’re all caught up
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    New booking requests will show up here.
                  </p>
                </div>
              )}
            </section>
            <section className="rounded-[1.6rem] border border-[#eee3dc] bg-white p-5 shadow-[0_16px_42px_-35px_rgba(82,43,44,.36)] sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-rose-800">
                Quick actions
              </p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-stone-900">
                Keep things moving
              </h2>
              <div className="mt-4 grid gap-2.5">
                <QuickAction
                  href="/dashboard/vendor/add-service"
                  icon={Plus}
                  title="Add a new service"
                  text="Share another offering with couples"
                />
                <QuickAction
                  href="/dashboard/vendor/my-services"
                  icon={ClipboardList}
                  title="Manage my services"
                  text="Update details and availability"
                />
                <QuickAction
                  href="/dashboard/vendor/subscription"
                  icon={CircleDollarSign}
                  title={premium ? "View Premium plan" : "Explore Premium"}
                  text={
                    premium
                      ? "Review your current plan"
                      : "Unlock unlimited listings"
                  }
                />
              </div>
            </section>
          </div>
          <p className="mt-5 text-center text-[10px] text-stone-400">
            Prices display using your service currency.{" "}
            {services.length
              ? `Average listed price: ${formatCurrency(services.reduce((sum, item) => sum + item.price, 0) / services.length, services[0]?.currency || "USD")}.`
              : "Add your first service to get started."}
          </p>
        </>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  note,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string | number;
  note: string;
  icon: LucideIcon;
  tone: "rose" | "green" | "amber" | "violet";
}) {
  const tones = {
    rose: "bg-rose-50 text-rose-800",
    green: "bg-emerald-50 text-emerald-800",
    amber: "bg-amber-50 text-amber-800",
    violet: "bg-violet-50 text-violet-800",
  };
  return (
    <article className="rounded-[1.35rem] border border-[#eee3dc] bg-white p-4 shadow-[0_12px_30px_-25px_rgba(82,43,44,.35)]">
      <span
        className={`flex size-9 items-center justify-center rounded-xl ${tones[tone]}`}
      >
        <Icon aria-hidden="true" size={18} />
      </span>
      <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
        {value}
      </p>
      <p className="mt-1 text-[10px] leading-4 text-stone-500">{note}</p>
    </article>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  text,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl border border-[#f0e8e2] bg-[#fffdfa] p-3 transition hover:border-rose-200 hover:bg-rose-50/40"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-rose-800 shadow-sm">
        <Icon size={16} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-stone-800">
          {title}
        </span>
        <span className="mt-1 block truncate text-[10px] text-stone-500">
          {text}
        </span>
      </span>
      <ArrowRight
        aria-hidden="true"
        size={15}
        className="text-stone-400 transition group-hover:translate-x-0.5 group-hover:text-rose-800"
      />
    </Link>
  );
}
