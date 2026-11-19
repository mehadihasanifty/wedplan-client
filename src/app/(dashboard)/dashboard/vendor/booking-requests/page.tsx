import { VendorBookingRequests } from "@/components/dashboard/vendor/VendorBookingRequests";

// Booking data is scoped to the authenticated vendor session.
export const instant = false;

export default function VendorBookingRequestsPage() {
  return <VendorBookingRequests />;
}
