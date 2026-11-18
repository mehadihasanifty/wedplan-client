export type UserRole = "admin" | "vendor" | "customer";
export type Service = { id: string; serviceName: string; category: string; description?: string; price: number; location: string; images?: string[]; vendorId?: string; status?: "pending" | "approved" | "rejected"; isActive?: boolean };
export type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled";
export type Booking = { id: string; serviceId: string; vendorId: string; customerId: string; eventDate: string; eventLocation: string; message?: string; status: BookingStatus; createdAt: string };
