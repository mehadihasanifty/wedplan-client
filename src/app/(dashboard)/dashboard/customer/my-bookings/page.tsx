import { CustomerBookings } from "@/components/dashboard/customer/CustomerBookings";

// Booking data is tied to the signed-in customer and is loaded after the
// client session is checked, so this segment is intentionally allowed to block.
export const instant = false;

export default function MyBookingsPage() {
  return <CustomerBookings />;
}
