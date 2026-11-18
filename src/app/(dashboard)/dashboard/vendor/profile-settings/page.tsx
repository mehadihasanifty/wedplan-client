import { VendorProfileSettings } from "@/components/dashboard/vendor/VendorProfileSettings";

// This protected page waits for the vendor session in its parent layout.
// It may block briefly while authentication state is resolved.
export const instant = false;

export default function VendorProfileSettingsPage() {
  return <VendorProfileSettings />;
}
