import { api } from "@/lib/api";

export async function createCheckoutSession() {
  const { data } = await api.post<{ url: string }>("/api/payments/create-checkout-session");
  return data;
}
