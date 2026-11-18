import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
export default function DashboardIndexPage() { return <main className="mx-auto max-w-4xl p-6 md:p-10"><PageHeader title="Your dashboard" description="Your WedPlan workspace will appear here once your account role is available." /><EmptyState title="Dashboard is being prepared" description="Sign in with your account to continue to your role-specific workspace." /></main>; }
