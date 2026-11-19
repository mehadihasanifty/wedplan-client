import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

// This route is protected by the admin session guard.
export const instant = false;

export default function AdminProfileSettingsPage() { return <><PageHeader title="Profile settings" description="Manage your account profile and contact details." /><EmptyState title="Profile settings scaffolded" /></>; }
