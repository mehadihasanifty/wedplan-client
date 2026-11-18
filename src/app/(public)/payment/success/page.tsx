import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
export default function PaymentSuccessPage() { return <><PageHeader title="Payment received" description="Premium activation is confirmed by a verified Stripe webhook." /><EmptyState title="Payment confirmation" description="This page will display the verified subscription result." /></>; }
