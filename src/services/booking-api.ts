import { api } from "@/lib/api";
import type { Booking, BookingStatus } from "@/types";

export type CreateBookingInput = Pick<Booking, "serviceId" | "eventDate" | "eventLocation" | "message">;

export async function createBooking(input: CreateBookingInput) {
  const { data } = await api.post<Booking>("/bookings", input);
  return data;
}

export async function getVendorBookings(vendorId: string) {
  const { data } = await api.get<Booking[]>("/bookings", { params: { vendorId, limit: 100 } });
  return data;
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
  const { data } = await api.patch<Booking>(`/bookings/${encodeURIComponent(id)}`, { status });
  return data;
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
