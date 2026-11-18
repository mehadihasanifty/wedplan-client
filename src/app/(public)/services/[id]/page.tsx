import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export default async function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <><PageHeader title="Service details" description={`Service reference: ${id}`} /><EmptyState title="Service details will appear here" description="Connect the API and booking flow to display this listing." /></>;
}
