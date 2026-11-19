import { AdminOverview } from "@/components/dashboard/admin/AdminDashboard";

// Admin content is gated by the authenticated admin session.
export const instant = false;

export default function AdminOverviewPage() {
  return <AdminOverview />;
}
