import { VendorSubscription } from "@/components/dashboard/vendor/VendorSubscription";

// Subscription information is scoped to the authenticated vendor session.
export const instant = false;

export default function VendorSubscriptionPage() {
  return <VendorSubscription />;
}
