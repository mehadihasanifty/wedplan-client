import { api } from "@/lib/api";
import type { Booking, BookingStatus } from "@/types";

export type CreateBookingInput = Pick<Booking, "serviceId" | "eventDate" | "eventLocation" | "message">;

export async function createBooking(input: CreateBookingInput) {
  const { data } = await api.post<Booking>("/bookings", input);
  return data;
}

export async function getVendorBookings(_vendorId: string) {
  const { data } = await api.get<Booking[]>("/vendor/bookings", { params: { limit: 100 } });
  return data;
}

export async function getCustomerBookings(customerId: string) {
  const { data } = await api.get<Booking[]>("/bookings", { params: { limit: 100 } });
  return data.filter((booking) => String(booking.customerId) === String(customerId));
}

export async function updateBookingStatus(id: string, status: Extract<BookingStatus, "accepted" | "rejected">) {
  const { data } = await api.patch<Booking>(`/vendor/bookings/${encodeURIComponent(id)}`, { status });
  return data;
}

export async function cancelBooking(id: string) {
  const { data } = await api.patch<Booking>(`/bookings/${encodeURIComponent(id)}`, { status: "cancelled" });
  return data;
}
