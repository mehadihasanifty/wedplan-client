export type UserRole = "admin" | "vendor" | "customer";
export type VendorSummary = {
  id?: string;
  _id?: string;
  name?: string;
  businessName?: string;
  email?: string;
  image?: string;
};
export type ServiceStatus = "pending" | "approved" | "rejected";
export type Service = {
  id?: string;
  _id?: string;
  serviceName: string;
  category: string;
  description?: string;
  price: number;
  currency?: string;
  location: string;
  images?: string[];
  vendorId?: string;
  vendor?: VendorSummary;
  status?: ServiceStatus;
  isActive?: boolean;
  createdAt?: string;
};
export type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled";
export type BookingParty = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  image?: string;
  businessName?: string;
};
export type BookingService = Pick<
  Service,
  | "id"
  | "_id"
  | "serviceName"
  | "category"
  | "price"
  | "currency"
  | "images"
  | "location"
  | "vendorId"
> & { vendor?: VendorSummary };
export type Booking = {
  id?: string;
  _id?: string;
  serviceId: string;
  vendorId: string;
  customerId: string;
  eventDate: string;
  eventLocation: string;
  message?: string;
  status: BookingStatus;
  createdAt?: string;
  requestedAt?: string;
  customer?: BookingParty;
  vendor?: BookingParty;
  service?: BookingService;
};
