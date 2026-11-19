import { VendorOverview } from "@/components/dashboard/vendor/VendorOverview";

// This dashboard is personalized from the authenticated vendor session and
// client-fetched booking/service data, so it must render on navigation instead
// of being treated as an instant, user-independent segment.
export const instant = false;

export default function VendorOverviewPage() {
  return <VendorOverview />;
}
