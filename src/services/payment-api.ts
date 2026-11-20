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
  const response = await fetch("/api/checkout-session", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: "{}",
    cache: "no-store",
  });
  const data = (await response.json().catch(() => ({}))) as {
    url?: string;
    message?: string;
  };
  if (!response.ok) {
    throw new Error(data.message || "Could not start secure Stripe checkout.");
  }
  if (!data.url) throw new Error("Stripe did not return a checkout URL.");
  return { url: data.url };
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
