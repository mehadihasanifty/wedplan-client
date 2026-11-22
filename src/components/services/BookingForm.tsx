"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, CheckCircle2, MapPin } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { createBooking } from "@/services/booking-api";
import type { Service } from "@/types";
import { toast } from "sonner";

type SessionUser = {
  id?: string;
  _id?: string;
  role?: "admin" | "vendor" | "customer";
};

export function BookingForm({ service }: { service: Service }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as SessionUser | undefined;
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const id = service.id ?? service._id;
  const vendorId =
    service.vendorId ?? service.vendor?.id ?? service.vendor?._id;
  const ownService = Boolean(
    user && vendorId && (user.id === vendorId || user._id === vendorId),
  );
  const signInHref = `/signin?callbackURL=${encodeURIComponent(`/services/${id ?? ""}`)}`;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!id || !user || user.role !== "customer" || ownService) return;
    setSubmitting(true);
    setError("");
    try {
      await createBooking({
        serviceId: id,
        eventDate,
        eventLocation: eventLocation.trim(),
        message: message.trim() || undefined,
      });
      setSent(true);
      toast.success("Booking request sent", {
        description:
          "You can follow its progress from your customer dashboard.",
      });
      router.refresh();
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : "Your request could not be sent. Please check your details and try again.";
      setError(message);
      toast.error("Booking request failed", { description: message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="booking"
      aria-labelledby="booking-title"
      className="rounded-[1.7rem] border border-[#eee1d7] bg-white p-5 shadow-[0_18px_55px_-40px_rgba(82,43,44,.4)] sm:p-6"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.19em] text-rose-800">
        Make it yours
      </p>
      <h2
        id="booking-title"
        className="mt-2 text-xl font-semibold tracking-tight text-stone-900"
      >
        Request to book
      </h2>
      <p className="mt-2 text-sm leading-6 text-stone-600">
        Send the vendor a request with a few details about your celebration.
      </p>
      {isPending ? (
        <div className="mt-5 h-12 animate-pulse rounded-xl bg-rose-50" />
      ) : sent ? (
        <div
          role="status"
          className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
        >
          <p className="flex items-center gap-2 font-semibold">
            <CheckCircle2 size={18} />
            Request sent
          </p>
          <p className="mt-1 leading-6">
            Your booking request is on its way. You can follow its progress from
            your customer dashboard.
          </p>
        </div>
      ) : !user ? (
        <Link
          href={signInHref}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-rose-800 px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-rose-950/10 transition hover:bg-rose-900"
        >
          Sign in to request a booking
          <ArrowRight size={16} />
        </Link>
      ) : ownService ? (
        <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          You can’t book a service listed by your own vendor account.
        </p>
      ) : user.role !== "customer" ? (
        <p className="mt-5 rounded-xl bg-stone-50 p-4 text-sm leading-6 text-stone-600">
          Booking requests are available to customer accounts.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-5 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-stone-700">
            Event date
            <span className="relative">
              <CalendarDays
                aria-hidden="true"
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-700"
              />
              <input
                required
                type="date"
                value={eventDate}
                onFocus={(event) => {
                  event.currentTarget.min = new Date().toISOString().slice(0, 10);
                }}
                onChange={(event) => setEventDate(event.target.value)}
                className="h-12 w-full rounded-xl border border-[#eadfd5] bg-white pl-10 pr-3 text-sm font-normal outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              />
            </span>
          </label>
          <label className="grid gap-2 text-sm font-medium text-stone-700">
            Event location
            <span className="relative">
              <MapPin
                aria-hidden="true"
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-700"
              />
              <input
                required
                value={eventLocation}
                onChange={(event) => setEventLocation(event.target.value)}
                placeholder="City or venue"
                className="h-12 w-full rounded-xl border border-[#eadfd5] bg-white pl-10 pr-3 text-sm font-normal outline-none transition placeholder:text-stone-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              />
            </span>
          </label>
          <label className="grid gap-2 text-sm font-medium text-stone-700">
            A note for the vendor{" "}
            <span className="text-xs font-normal text-stone-500">Optional</span>
            <textarea
              rows={3}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Share a little about what you have in mind…"
              className="w-full resize-y rounded-xl border border-[#eadfd5] bg-white px-3.5 py-3 text-sm font-normal outline-none transition placeholder:text-stone-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
            />
          </label>
          {error && (
            <p role="alert" className="text-sm text-rose-800">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-rose-800 px-5 text-sm font-semibold text-white shadow-md shadow-rose-950/10 transition hover:bg-rose-900 disabled:cursor-wait disabled:opacity-60"
          >
            {submitting ? "Sending request…" : "Send booking request"}
            <ArrowRight size={16} />
          </button>
        </form>
      )}
    </section>
  );
}
