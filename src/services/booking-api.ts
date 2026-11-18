import { api } from "@/lib/api";
import type { Booking } from "@/types";
export type CreateBookingInput = Pick<Booking, "serviceId" | "eventDate" | "eventLocation" | "message">;
export async function createBooking(input: CreateBookingInput) { const { data } = await api.post<Booking>("/bookings", input); return data; }
export async function getVendorBookings(vendorId: string) { const { data } = await api.get<Booking[]>("/bookings", { params: { vendorId, limit: 100 } }); return data; }
export async function updateBookingStatus(id: string, status: Extract<Booking["status"], "accepted" | "rejected">) { const { data } = await api.patch<Booking>(`/bookings/${encodeURIComponent(id)}`, { status }); return data; }
