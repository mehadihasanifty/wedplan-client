import { CustomerOverview } from "@/components/dashboard/customer/CustomerOverview";

// The customer layout checks the live authentication session before rendering.
// This protected route can block briefly while that session is resolved.
export const instant = false;

export default function CustomerOverviewPage() {
  return <CustomerOverview />;
}
