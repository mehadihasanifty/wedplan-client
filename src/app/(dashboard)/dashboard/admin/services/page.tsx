import { AdminServices } from "@/components/dashboard/admin/AdminDashboard";

// Service moderation is available only to authenticated admins.
export const instant = false;

export default function ManageServicesPage() {
  return <AdminServices />;
}
