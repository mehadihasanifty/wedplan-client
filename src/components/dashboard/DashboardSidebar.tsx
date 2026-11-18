import Link from "next/link";
type Role = "vendor" | "customer" | "admin";
const navigation: Record<Role, { href: string; label: string }[]> = {
  vendor: [{ href: "/dashboard/vendor", label: "Overview" }, { href: "/dashboard/vendor/my-services", label: "My services" }, { href: "/dashboard/vendor/add-service", label: "Add service" }, { href: "/dashboard/vendor/booking-requests", label: "Booking requests" }, { href: "/dashboard/vendor/subscription", label: "Subscription" }],
  customer: [{ href: "/dashboard/customer", label: "Overview" }, { href: "/dashboard/customer/my-bookings", label: "My bookings" }],
  admin: [{ href: "/dashboard/admin", label: "Overview" }, { href: "/dashboard/admin/users", label: "Users" }, { href: "/dashboard/admin/services", label: "Services" }, { href: "/dashboard/admin/transactions", label: "Transactions" }],
};
export function DashboardSidebar({ role }: { role: Role }) { return <aside className="border-b p-4 md:border-b-0 md:border-r"><p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{role} workspace</p><nav aria-label={`${role} dashboard`} className="flex gap-2 overflow-x-auto md:flex-col">{navigation[role].map(item => <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-md px-3 py-2 text-sm hover:bg-muted">{item.label}</Link>)}</nav></aside>; }
