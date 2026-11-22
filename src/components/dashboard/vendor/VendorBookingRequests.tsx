"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  MessageSquareText,
  UserRound,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getVendorBookings, updateBookingStatus } from "@/services/booking-api";
import type { Booking } from "@/types";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Loading } from "@/components/shared/Loading";
import { toast } from "sonner";

type VendorUser = { id?: string; _id?: string };

export function VendorBookingRequests() {
  const { data: session } = authClient.useSession();
  const user = session?.user as VendorUser | undefined;
  const vendorId = user?.id ?? user?._id;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [filter, setFilter] = useState<
    "all" | "pending" | "accepted" | "rejected" | "cancelled"
  >("all");

  async function refresh() {
    if (!vendorId) return;
    const bookingData = await getVendorBookings(vendorId);
    // The API already scopes results to the signed-in vendor. Avoid a second
    // client-side ID comparison because legacy records may store ObjectIds.
    setBookings(bookingData);
  }

  useEffect(() => {
    if (!vendorId) return;
    let active = true;
    getVendorBookings(vendorId)
      .then((bookingData) => {
        if (active) setBookings(bookingData);
      })
      .catch(() => {
        if (active)
          setError(
            "We couldn’t load your booking requests. Please refresh and try again.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [vendorId]);

  async function decide(booking: Booking, status: "accepted" | "rejected") {
    const id = booking.id ?? booking._id;
    if (
      !id ||
      booking.status !== "pending" ||
      String(booking.vendorId) !== String(vendorId)
    )
      return;
    setBusyId(id);
    setError("");
    try {
      await updateBookingStatus(id, status);
      await refresh();
      toast.success(
        status === "accepted"
          ? "Booking request accepted."
          : "Booking request rejected.",
      );
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : "Could not update this booking request.";
      setError(message);
      toast.error("Could not process booking request", {
        description: message,
      });
    } finally {
      setBusyId("");
    }
  }

  const filtered = bookings.filter(
    (item) => filter === "all" || item.status === filter,
  );
  const counts = {
    all: bookings.length,
    pending: bookings.filter((item) => item.status === "pending").length,
    accepted: bookings.filter((item) => item.status === "accepted").length,
    rejected: bookings.filter((item) => item.status === "rejected").length,
    cancelled: bookings.filter((item) => item.status === "cancelled").length,
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-800">
          Your conversations
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#352321]">
          Booking requests
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Review each couple’s request and reply while it’s still pending.
        </p>
      </div>
      {error && (
        <div className="mb-4">
          <ErrorState message={error} />
        </div>
      )}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {(["all", "pending", "accepted", "rejected", "cancelled"] as const).map(
          (item) => (
            <button
              type="button"
              key={item}
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
              className={`shrink-0 rounded-full border px-3.5 py-2 text-sm font-semibold capitalize transition ${filter === item ? "border-rose-800 bg-rose-800 text-white" : "border-[#eadfd5] bg-white text-stone-600 hover:border-rose-200 hover:bg-rose-50"}`}
            >
              {item}{" "}
              <span
                className={filter === item ? "text-rose-100" : "text-stone-400"}
              >
                {counts[item]}
              </span>
            </button>
          ),
        )}
      </div>
      {loading ? (
        <Loading label="Loading booking requests…" />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={
            bookings.length
              ? "No requests in this view"
              : "No booking requests yet"
          }
          description={
            bookings.length
              ? "Choose another status filter to view requests."
              : "Couples’ requests for your services will appear here."
          }
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((booking, index) => {
            const service = booking.service;
            const bookingId =
              booking.id ?? booking._id ?? `${booking.customerId}-${index}`;
            const pending = booking.status === "pending";
            return (
              <article
                key={bookingId}
                className="overflow-hidden rounded-[1.55rem] border border-[#eee3dc] bg-white shadow-[0_15px_40px_-34px_rgba(82,43,44,.38)]"
              >
                <div className="flex items-start justify-between gap-3 border-b border-[#f0e8e2] bg-[linear-gradient(110deg,#fffdfa,#fbf6f1)] px-4 py-4 sm:px-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-800">
                      <UserRound size={18} />
                    </span>
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-semibold text-stone-900">
                        {booking.customer?.name || "WedPlan customer"}
                      </h2>
                      <p className="mt-0.5 truncate text-xs text-stone-500">
                        {booking.customer?.email ||
                          `Customer ID: ${booking.customerId}`}
                      </p>
                    </div>
                  </div>
                  <Status status={booking.status} />
                </div>
                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-rose-100 to-amber-100">
                      {service?.images?.[0] && (
                        <span
                          role="img"
                          aria-label="Service photo"
                          className="size-full bg-cover bg-center"
                          style={{
                            backgroundImage: `url("${service?.images?.[0]}")`,
                          }}
                        />
                      )}
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.13em] text-stone-500">
                        Requested service
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-stone-900">
                        {service?.serviceName || `Service ${booking.serviceId}`}
                      </p>
                      {service?.category && (
                        <p className="mt-0.5 text-xs text-rose-800">
                          {service.category}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Info
                      icon={CalendarDays}
                      label="Event date"
                      value={
                        booking.eventDate
                          ? new Date(booking.eventDate).toLocaleDateString(
                              "en",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          : "Not provided"
                      }
                    />
                    <Info
                      icon={MapPin}
                      label="Event location"
                      value={booking.eventLocation || "Not provided"}
                    />
                  </div>
                  <div className="mt-4 rounded-xl bg-[#fbf8f5] px-3.5 py-3">
                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.13em] text-stone-500">
                      <MessageSquareText size={12} />
                      Customer message
                    </p>
                    <p className="mt-1.5 whitespace-pre-line text-xs leading-5 text-stone-700">
                      {booking.message || "No additional message."}
                    </p>
                  </div>
                  {pending && (
                    <div className="mt-4 flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        disabled={busyId === bookingId}
                        aria-busy={busyId === bookingId}
                        onClick={() => decide(booking, "rejected")}
                        className="inline-flex h-10 items-center gap-1.5 rounded-full border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-800 transition hover:bg-rose-50 disabled:opacity-50"
                      >
                        {busyId === bookingId ? (
                          <Clock3 size={14} className="animate-spin" />
                        ) : (
                          <X size={14} />
                        )}
                        {busyId === bookingId ? "Processing…" : "Reject"}
                      </button>
                      <button
                        type="button"
                        disabled={busyId === bookingId}
                        aria-busy={busyId === bookingId}
                        onClick={() => decide(booking, "accepted")}
                        className="inline-flex h-10 items-center gap-1.5 rounded-full bg-rose-800 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-900 disabled:opacity-50"
                      >
                        {busyId === bookingId ? (
                          <Clock3 size={14} className="animate-spin" />
                        ) : (
                          <Check size={14} />
                        )}
                        {busyId === bookingId
                          ? "Processing…"
                          : "Accept request"}
                      </button>
                    </div>
                  )}
                  {!pending && (
                    <p className="mt-4 border-t border-[#f0e8e2] pt-3 text-xs text-stone-500">
                      This request has been processed and can no longer be
                      changed.
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Status({ status }: { status: string }) {
  const tone =
    status === "accepted"
      ? "bg-emerald-50 text-emerald-800"
      : status === "rejected"
        ? "bg-rose-50 text-rose-800"
        : status === "cancelled"
          ? "bg-stone-100 text-stone-600"
          : "bg-amber-50 text-amber-800";
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold capitalize ${tone}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <Icon size={15} className="mt-0.5 shrink-0 text-rose-700" />
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-medium text-stone-800">
          {value}
        </p>
      </div>
    </div>
  );
}
