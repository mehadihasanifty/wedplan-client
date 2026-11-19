import { AdminUsers } from "@/components/dashboard/admin/AdminDashboard";

// User management is available only to authenticated admins.
export const instant = false;

export default function ManageUsersPage() { return <AdminUsers />; }
