import { VendorServicesManager } from "@/components/dashboard/vendor/VendorServicesManager";

// Service data is scoped to the authenticated vendor session.
export const instant = false;

export default function MyServicesPage() {
  return <VendorServicesManager />;
}
