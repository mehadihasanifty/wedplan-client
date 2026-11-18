import { PageHeader } from "@/components/shared/PageHeader";
import { ServiceFilters } from "@/components/services/ServiceFilters";
import { EmptyState } from "@/components/shared/EmptyState";

export default function ServicesPage() {
  return <><PageHeader title="Wedding services" description="Browse wedding professionals and find the right fit for your celebration." /><ServiceFilters /><div className="mt-6"><EmptyState title="Services will appear here" description="Connect the services API to browse approved listings." /></div></>;
}
