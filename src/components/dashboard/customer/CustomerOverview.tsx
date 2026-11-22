"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CalendarDays,
  CircleCheck,
  CircleX,
  Compass,
  Flower2,
  type LucideIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getCustomerBookings } from "@/services/booking-api";
import type { Booking } from "@/types";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";

export function CustomerOverview() {
  const { data: session } = authClient.useSession();
  const user = session?.user as
    { id?: string; _id?: string; name?: string; image?: string } | undefined;
  const customerId = user?.id ?? user?._id;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!customerId) return;
    let active = true;
    getCustomerBookings(customerId)
      .then((items) => {
        if (active) {
          setBookings(items);
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
  }, [customerId]);

  const pending = bookings.filter(
    (booking) => booking.status === "pending",
  ).length;
  const accepted = bookings.filter(
    (booking) => booking.status === "accepted",
  ).length;
  const rejected = bookings.filter(
    (booking) => booking.status === "rejected",
  ).length;
  const firstName = user?.name?.trim().split(/\s+/)[0] || "there";

  return (
    <div className="mx-auto max-w-7xl">
      <header className="relative mb-7 overflow-hidden rounded-[1.8rem] border border-[#e9d9cf] bg-[linear-gradient(120deg,#fffaf6,#f8eee8_58%,#f1e3db)] px-5 py-6 shadow-[0_24px_65px_-52px_rgba(82,43,44,.42)] sm:px-8 sm:py-9">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-24 size-72 rounded-full border border-rose-900/[.07]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-2 size-48 rounded-full bg-rose-200/30 blur-3xl sm:right-12 sm:top-8"
        />
        <div className="relative grid grid-cols-[minmax(0,1fr)_4.25rem] items-center gap-3 sm:grid-cols-[minmax(0,1fr)_7rem] sm:gap-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-rose-800 sm:tracking-[0.19em]">
              Your celebration, thoughtfully planned
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#352321] sm:text-4xl">
              Welcome, {firstName}.
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">
              Keep every conversation and booking request in one lovely place.
            </p>
            <Link
              href="/services"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-rose-800 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-950/10 transition hover:-translate-y-0.5 hover:bg-rose-900 sm:mt-5 sm:py-3"
            >
              <Compass size={15} />
              Explore services
              <ArrowRight aria-hidden="true" size={13} />
            </Link>
          </div>
          <div
            aria-label="WedPlan floral emblem"
            role="img"
            className="relative mx-auto grid size-16 place-items-center rounded-[1.25rem] border border-white/90 bg-[linear-gradient(145deg,rgba(255,255,255,.92),rgba(250,231,232,.82))] text-rose-800 shadow-[0_14px_35px_-18px_rgba(139,46,76,.4)] ring-1 ring-rose-200/55 sm:size-28 sm:rounded-[1.75rem]"
          >
            <span
              aria-hidden="true"
              className="absolute inset-1.5 rounded-[1rem] border border-rose-200/70 sm:inset-2.5 sm:rounded-[1.25rem]"
            />
            <span
              aria-hidden="true"
              className="absolute size-10 rounded-full bg-rose-200/50 blur-md sm:size-16"
            />
            <Flower2
              aria-hidden="true"
              size={27}
              strokeWidth={1.45}
              className="relative sm:hidden"
            />
            <Flower2
              aria-hidden="true"
              size={43}
              strokeWidth={1.35}
              className="relative hidden sm:block"
            />
            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 size-2.5 rounded-full border-2 border-[#fbf3ed] bg-rose-400 sm:-right-1.5 sm:-top-1.5 sm:size-3.5"
            />
          </div>
        </div>
      </header>

      {loading ? (
        <Loading label="Gathering your booking activity…" />
      ) : error ? (
        <ErrorState message="We couldn’t load your booking activity. Please refresh and try again." />
      ) : (
        <>
          <section
            aria-label="Booking statistics"
            className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
          >
            <Metric
              label="Total requests"
              value={bookings.length}
              note="All your service requests"
              icon={CalendarDays}
              tone="rose"
            />
            <Metric
              label="Pending"
              value={pending}
              note="Waiting for a vendor reply"
              icon={CalendarClock}
              tone="amber"
            />
            <Metric
              label="Accepted"
              value={accepted}
              note="Confirmed with your vendor"
              icon={CircleCheck}
              tone="green"
            />
            <Metric
              label="Rejected"
              value={rejected}
              note="Requests declined by vendors"
              icon={CircleX}
              tone="stone"
            />
          </section>
          <div className="mt-7 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-[1.6rem] border border-[#eee3dc] bg-white p-5 shadow-[0_16px_42px_-35px_rgba(82,43,44,.36)] sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.17em] text-rose-800">
                    Your activity
                  </p>
                  <h2 className="mt-1 text-lg font-semibold tracking-tight text-stone-900">
                    Recent booking requests
                  </h2>
                </div>
                <Link
                  href="/dashboard/customer/my-bookings"
                  className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-rose-800 transition hover:bg-rose-50"
                >
                  View all
                  <ArrowRight size={14} />
                </Link>
              </div>
              {bookings.length ? (
                <div className="mt-4 divide-y divide-[#f0e8e2]">
                  {bookings.slice(0, 4).map((booking, index) => (
                    <RecentBooking
                      key={
                        booking.id ??
                        booking._id ??
                        `${booking.serviceId}-${index}`
                      }
                      booking={booking}
                    />
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
                    Your planning starts here
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    Send a request to a vendor and it will show up here.
                  </p>
                  <Link
                    href="/services"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-rose-800 hover:text-rose-950"
                  >
                    Browse wedding services
                    <ArrowRight size={13} />
                  </Link>
                </div>
              )}
            </section>
            <section className="rounded-[1.6rem] border border-[#eee3dc] bg-white p-5 shadow-[0_16px_42px_-35px_rgba(82,43,44,.36)] sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.17em] text-rose-800">
                A little inspiration
              </p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-stone-900">
                Plan at your own pace
              </h2>
              <p className="mt-2 text-xs leading-5 text-stone-600">
                Explore trusted wedding professionals, compare your options, and
                keep each request organized here.
              </p>
              <div className="mt-5 grid gap-2.5">
                <QuickLink
                  href="/services"
                  icon={Compass}
                  title="Discover services"
                  text="Find the right people for your day"
                />
                <QuickLink
                  href="/dashboard/customer/my-bookings"
                  icon={CalendarDays}
                  title="Manage my bookings"
                  text="Review details and pending requests"
                />
                <QuickLink
                  href="/dashboard/customer/profile-settings"
                  icon={Flower2}
                  title="Update my profile"
                  text="Keep your account details current"
                />
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  note,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  note: string;
  icon: LucideIcon;
  tone: "rose" | "amber" | "green" | "stone";
}) {
  const tones = {
    rose: "bg-rose-50 text-rose-800",
    amber: "bg-amber-50 text-amber-800",
    green: "bg-emerald-50 text-emerald-800",
    stone: "bg-stone-100 text-stone-700",
  };
  return (
    <article className="rounded-[1.35rem] border border-[#eee3dc] bg-white p-4 shadow-[0_12px_30px_-25px_rgba(82,43,44,.35)]">
      <span
        className={`flex size-9 items-center justify-center rounded-xl ${tones[tone]}`}
      >
        <Icon aria-hidden="true" size={18} />
      </span>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
        {value}
      </p>
      <p className="mt-1 text-xs leading-4 text-stone-500">{note}</p>
    </article>
  );
}

function RecentBooking({ booking }: { booking: Booking }) {
  const statusTone: Record<Booking["status"], string> = {
    pending: "bg-amber-50 text-amber-800",
    accepted: "bg-emerald-50 text-emerald-800",
    rejected: "bg-stone-100 text-stone-700",
    cancelled: "bg-rose-50 text-rose-800",
  };
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-stone-800">
          {booking.service?.serviceName || "Wedding service"}
        </p>
        <p className="mt-1 text-xs text-stone-500">
          {formatDate(booking.eventDate)} ·{" "}
          {booking.eventLocation || "Location not set"}
        </p>
      </div>
      <span
        className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${statusTone[booking.status]}`}
      >
        {booking.status}
      </span>
    </div>
  );
}

function QuickLink({
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
        <span className="mt-1 block truncate text-xs text-stone-500">
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

export function formatDate(value?: string) {
  if (!value) return "Date not provided";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not provided";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
