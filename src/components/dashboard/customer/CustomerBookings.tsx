"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Check, ChevronDown, Clock3, MapPin, Store, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cancelBooking, getCustomerBookings } from "@/services/booking-api";
import type { Booking, BookingStatus } from "@/types";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Loading } from "@/components/shared/Loading";
import { formatDate } from "./CustomerOverview";

const filters: { label: string; value: "all" | BookingStatus }[] = [
  { label: "All requests", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
  { label: "Cancelled", value: "cancelled" },
];

export function CustomerBookings() {
  const { data: session } = authClient.useSession();
  const user = session?.user as { id?: string; _id?: string } | undefined;
  const customerId = user?.id ?? user?._id;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all");
  const [expandedId, setExpandedId] = useState("");
  const [confirmId, setConfirmId] = useState("");
  const [busyId, setBusyId] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!customerId) return;
    let active = true;
    getCustomerBookings(customerId)
      .then((data) => { if (active) { setBookings(data); setError(""); } })
      .catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : "We couldn’t load your bookings. Please try again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [customerId]);

  const filteredBookings = useMemo(() => bookings.filter((booking) => filter === "all" || booking.status === filter), [bookings, filter]);
  const counts = useMemo(() => ({ all: bookings.length, pending: bookings.filter((item) => item.status === "pending").length, accepted: bookings.filter((item) => item.status === "accepted").length, rejected: bookings.filter((item) => item.status === "rejected").length, cancelled: bookings.filter((item) => item.status === "cancelled").length }), [bookings]);

  async function handleCancel(booking: Booking) {
    const id = booking.id ?? booking._id;
    // Recheck ownership and status at the action boundary; the API must enforce both too.
    if (!id || !customerId || booking.customerId !== customerId || booking.status !== "pending") return;
    setBusyId(id);
    setError("");
    setNotice("");
    try {
      await cancelBooking(id);
      setBookings((current) => current.map((item) => (item.id ?? item._id) === id && item.customerId === customerId && item.status === "pending" ? { ...item, status: "cancelled" } : item));
      setConfirmId("");
      setNotice("Your pending booking request has been cancelled.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We couldn’t cancel this request. Please try again.");
    } finally {
      setBusyId("");
    }
  }

  return <div className="mx-auto max-w-7xl">
    <header className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-800">Your planning, all together</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#352321]">My bookings</h1><p className="mt-2 text-sm text-stone-600">Review your requests, event details, and vendor replies.</p></div><Link href="/services" className="inline-flex items-center gap-2 rounded-full bg-rose-800 px-4 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-900"><CalendarDays size={15} />Find a service</Link></header>
    <div className="mb-5 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter bookings">{filters.map((option) => <button key={option.value} type="button" role="tab" aria-selected={filter === option.value} onClick={() => setFilter(option.value)} className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition ${filter === option.value ? "border-rose-800 bg-rose-800 text-white" : "border-[#eadfd5] bg-white text-stone-600 hover:border-rose-200 hover:text-rose-900"}`}>{option.label}<span className={`rounded-full px-1.5 py-0.5 text-[9px] ${filter === option.value ? "bg-white/20 text-white" : "bg-[#f5eee8] text-stone-600"}`}>{counts[option.value]}</span></button>)}</div>
    {notice && <p role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{notice}</p>}
    {error && <div className="mb-4"><ErrorState message={error} /></div>}
    {loading ? <Loading label="Loading your bookings…" /> : filteredBookings.length === 0 ? <EmptyState title={bookings.length ? "No bookings in this view" : "No booking requests yet"} description={bookings.length ? "Choose another status to see your requests." : "When you request a wedding service, its details and status will appear here."} /> : <div className="grid gap-4 xl:grid-cols-2">{filteredBookings.map((booking, index) => <BookingCard key={booking.id ?? booking._id ?? `${booking.serviceId}-${index}`} booking={booking} customerId={customerId ?? ""} expanded={expandedId === (booking.id ?? booking._id)} confirmCancel={confirmId === (booking.id ?? booking._id)} busy={busyId === (booking.id ?? booking._id)} onToggleDetails={() => setExpandedId((current) => current === (booking.id ?? booking._id) ? "" : booking.id ?? booking._id ?? "")} onRequestCancel={() => setConfirmId((current) => current === (booking.id ?? booking._id) ? "" : booking.id ?? booking._id ?? "")} onConfirmCancel={() => handleCancel(booking)} />)}</div>}
  </div>;
}

function BookingCard({ booking, customerId, expanded, confirmCancel, busy, onToggleDetails, onRequestCancel, onConfirmCancel }: { booking: Booking; customerId: string; expanded: boolean; confirmCancel: boolean; busy: boolean; onToggleDetails: () => void; onRequestCancel: () => void; onConfirmCancel: () => void }) {
  const service = booking.service;
  const serviceName = service?.serviceName || "Wedding service";
  const image = service?.images?.[0] || service?.serviceImage;
  const vendor = booking.vendor ?? service?.vendor;
  const bookingId = booking.id ?? booking._id;
  const canCancel = Boolean(bookingId && booking.customerId === customerId && booking.status === "pending");
  const statusStyle: Record<BookingStatus, string> = { pending: "bg-amber-50 text-amber-800 ring-amber-200", accepted: "bg-emerald-50 text-emerald-800 ring-emerald-200", rejected: "bg-stone-100 text-stone-700 ring-stone-200", cancelled: "bg-rose-50 text-rose-800 ring-rose-200" };
  const requestDate = booking.createdAt || booking.requestedAt;

  return <article className="overflow-hidden rounded-[1.55rem] border border-[#eee3dc] bg-white shadow-[0_15px_40px_-34px_rgba(82,43,44,.38)]">
    <div className="flex items-start justify-between gap-3 border-b border-[#f0e8e2] bg-[linear-gradient(110deg,#fffdfa,#fbf6f1)] px-4 py-4 sm:px-5"><div className="flex min-w-0 items-center gap-3"><div role="img" aria-label={image ? `${serviceName} image` : "Wedding service image unavailable"} className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-100 to-amber-100 text-rose-800">{image ? <span className="size-full bg-cover bg-center" style={{ backgroundImage: `url("${image}")` }} /> : <Store size={22} />}</div><div className="min-w-0"><h2 className="truncate text-sm font-semibold text-stone-900">{serviceName}</h2><p className="mt-1 truncate text-[10px] text-stone-500">{service?.category || "Wedding service"}{service?.location ? ` · ${service.location}` : ""}</p></div></div><span className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-semibold capitalize ring-1 ring-inset ${statusStyle[booking.status]}`}>{booking.status}</span></div>
    <div className="p-4 sm:p-5"><div className="grid gap-3 sm:grid-cols-2"><Info icon={CalendarDays} label="Event date" value={formatDate(booking.eventDate)} /><Info icon={MapPin} label="Event location" value={booking.eventLocation || "Not provided"} /></div><div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#fbf8f5] px-3.5 py-3"><div className="flex items-center gap-2 text-xs text-stone-600"><Store size={14} className="text-rose-800" /><span>Vendor: <strong className="font-semibold text-stone-800">{vendor?.businessName || vendor?.name || service?.vendorName || service?.businessName || "Vendor details pending"}</strong></span></div><div className="flex items-center gap-1.5 text-[10px] text-stone-500"><Clock3 size={12} />Requested {formatDate(requestDate)}</div></div>
      {expanded && <div className="mt-3 grid gap-3 rounded-xl border border-[#f0e8e2] p-3.5 sm:grid-cols-2"><div><p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-stone-500">Booking details</p><p className="mt-1 text-xs leading-5 text-stone-700">{booking.message || "No message was included with this request."}</p></div><div><p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-stone-500">Service provider</p><p className="mt-1 text-xs leading-5 text-stone-700">{vendor?.businessName || vendor?.name || service?.vendorName || service?.businessName || "Vendor information will appear here when available."}{vendor?.email ? ` · ${vendor.email}` : ""}</p></div></div>}
      {confirmCancel && canCancel && <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/80 p-3.5"><p className="text-xs font-semibold text-amber-950">Cancel this pending request?</p><p className="mt-1 text-[10px] leading-4 text-amber-900">Only pending requests can be cancelled. Once cancelled, this request cannot be restored.</p><div className="mt-3 flex justify-end gap-2"><button type="button" onClick={onRequestCancel} disabled={busy} className="rounded-full px-3 py-2 text-[10px] font-semibold text-stone-600 hover:bg-white">Keep request</button><button type="button" onClick={onConfirmCancel} disabled={busy} className="inline-flex items-center gap-1.5 rounded-full bg-rose-800 px-3.5 py-2 text-[10px] font-semibold text-white disabled:opacity-55">{busy ? <Clock3 size={12} className="animate-spin" /> : <X size={12} />}Confirm cancellation</button></div></div>}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2"><button type="button" aria-expanded={expanded} onClick={onToggleDetails} className="inline-flex items-center gap-1.5 rounded-full border border-[#eadfd5] bg-white px-3.5 py-2.5 text-[10px] font-semibold text-stone-700 transition hover:border-rose-200 hover:text-rose-900">{expanded ? "Hide details" : "View booking details"}<ChevronDown size={13} className={`transition ${expanded ? "rotate-180" : ""}`} /></button>{canCancel && !confirmCancel && <button type="button" onClick={onRequestCancel} disabled={busy} className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2.5 text-[10px] font-semibold text-rose-800 transition hover:bg-rose-50 disabled:opacity-50"><X size={13} />Cancel pending request</button>}{!canCancel && booking.status !== "pending" && <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-stone-500"><Check size={13} />This request can no longer be cancelled</span>}<Link href={`/services/${encodeURIComponent(booking.serviceId)}`} className="inline-flex items-center gap-1 rounded-full px-3 py-2.5 text-[10px] font-semibold text-rose-800 hover:bg-rose-50">View service<ArrowRight size={13} /></Link></div>
    </div>
  </article>;
}

function Info({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
  return <div className="flex min-w-0 items-start gap-2.5 rounded-xl border border-[#f0e8e2] px-3 py-2.5"><Icon size={15} className="mt-0.5 shrink-0 text-rose-800" /><div className="min-w-0"><p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-stone-500">{label}</p><p className="mt-1 break-words text-xs font-medium text-stone-800">{value}</p></div></div>;
}
