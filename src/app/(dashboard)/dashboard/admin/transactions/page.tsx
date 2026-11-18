import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
export default function TransactionsPage() { return <><PageHeader title="Transactions" description="Review subscription transactions confirmed by Stripe webhooks." /><EmptyState title="Transactions scaffolded" /></>; }
