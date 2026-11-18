import type { Booking, BookingStatus } from "@/types";

export type CreateBookingInput = Pick<Booking, "serviceId" | "eventDate" | "eventLocation" | "message">;

async function bookingRequest<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const data = await response.json() as T | { message?: string };
  if (!response.ok) throw new Error((data as { message?: string }).message || "The booking request could not be completed.");
  return data as T;
}

export async function createBooking(input: CreateBookingInput) {
  return bookingRequest<Booking>("/api/bookings", { method: "POST", body: JSON.stringify(input) });
}

export async function getVendorBookings(_vendorId: string) {
  return bookingRequest<Booking[]>("/api/vendor/bookings?limit=100", { cache: "no-store" });
}

export async function getCustomerBookings(customerId: string) {
  const response = await fetch("/api/bookings?limit=100", { credentials: "same-origin", cache: "no-store" });
  const data = await response.json() as Booking[] | { message?: string };
  if (!response.ok) throw new Error((data as { message?: string }).message || "We couldn’t load your bookings.");
  if (!Array.isArray(data)) throw new Error("The bookings response was not valid.");
  // Keep the customer UI scoped to the signed-in account. The API must also enforce ownership.
  return data.filter((booking) => booking.customerId === customerId);
}

export async function updateBookingStatus(id: string, status: Extract<BookingStatus, "accepted" | "rejected">) {
  return bookingRequest<Booking>(`/api/vendor/bookings/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify({ status }) });
}

export async function cancelBooking(id: string) {
  const response = await fetch(`/api/bookings/${encodeURIComponent(id)}`, {
    method: "PATCH",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "cancelled" }),
  });
  const data = await response.json() as Booking | { message?: string };
  if (!response.ok) throw new Error((data as { message?: string }).message || "We couldn’t cancel this booking.");
  return data as Booking;
}
