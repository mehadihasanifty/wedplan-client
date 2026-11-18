import { api } from "@/lib/api";
import type { Booking } from "@/types";
export type CreateBookingInput = Pick<Booking, "serviceId" | "eventDate" | "eventLocation" | "message">;
export async function createBooking(input: CreateBookingInput) { const { data } = await api.post<Booking>("/bookings", input); return data; }
