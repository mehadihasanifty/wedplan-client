import { AdminTransactions } from "@/components/dashboard/admin/AdminDashboard";

// Transaction records are available only to authenticated admins.
export const instant = false;

export default function TransactionsPage() {
  return <AdminTransactions />;
}
