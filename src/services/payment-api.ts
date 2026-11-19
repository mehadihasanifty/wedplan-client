import { api } from "@/lib/api";

export type CheckoutStatus = {
  confirmed: boolean;
  paymentStatus: "paid" | "pending" | "failed" | "expired";
  subscriptionPlan: string;
  message: string;
};

export type SubscriptionInfo = {
  plan: string;
  status: string;
  cancelAtPeriodEnd: boolean;
  subscriptionExpiresAt?: string | null;
  price?: { unitAmount: number; currency: string; interval: string } | null;
};

export async function createCheckoutSession() {
  const { data } = await api.post<{ url: string }>(
    "/payments/create-checkout-session",
  );
  return data;
}

export async function getCheckoutStatus(sessionId: string) {
  const { data } = await api.get<CheckoutStatus>(
    `/payments/checkout-session/${encodeURIComponent(sessionId)}`,
  );
  return data;
}

export async function getSubscriptionInfo() {
  const { data } = await api.get<SubscriptionInfo>("/payments/subscription");
  return data;
}

export async function createBillingPortalSession() {
  const { data } = await api.post<{ url: string }>(
    "/payments/create-portal-session",
  );
  return data;
}
