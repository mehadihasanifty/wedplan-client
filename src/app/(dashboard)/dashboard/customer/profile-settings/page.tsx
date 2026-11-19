import { CustomerProfileSettings } from "@/components/dashboard/customer/CustomerProfileSettings";

// Profile settings depend on the authenticated customer's session and account data.
export const instant = false;

export default function CustomerProfileSettingsPage() {
  return <CustomerProfileSettings />;
}
