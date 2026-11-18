import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";

// This protected page waits for the vendor session in its parent layout.
// It may block briefly while authentication state is resolved.
export const instant = false;

export default function VendorProfileSettingsPage() {
  return (
    <>
      <PageHeader title="Profile settings" description="Manage your vendor profile and contact details." />
      <EmptyState title="Profile settings scaffolded" />
    </>
  );
}
