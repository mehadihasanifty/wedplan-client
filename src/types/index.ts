export type UserRole = "admin" | "vendor" | "customer";
export type VendorSummary = { id?: string; _id?: string; name?: string; businessName?: string; image?: string };
export type Service = { id?: string; _id?: string; serviceName: string; category: string; description?: string; price: number; currency?: string; location: string; images?: string[]; serviceImage?: string; vendorId?: string; vendor?: VendorSummary; vendorName?: string; businessName?: string; status?: "pending" | "approved" | "rejected"; isActive?: boolean };
export type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled";
export type Booking = { id: string; serviceId: string; vendorId: string; customerId: string; eventDate: string; eventLocation: string; message?: string; status: BookingStatus; createdAt: string };
