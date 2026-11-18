import { api } from "@/lib/api";
import type { Service } from "@/types";
export type CreateServiceInput = Omit<Service, "id" | "_id" | "vendorId" | "vendor"> & { status?: Service["status"] };
export async function getServices(params?: Record<string, string | number | undefined>) { const { data } = await api.get<Service[]>("/services", { params }); return data; }
export async function getPublicServices(params?: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && key !== "status" && key !== "isActive") query.set(key, String(value));
  }
  const response = await fetch(`/api/services${query.size ? `?${query.toString()}` : ""}`, { cache: "no-store" });
  const data = await response.json() as Service[] | { message?: string };
  if (!response.ok) throw new Error((data as { message?: string }).message || "Could not load wedding services.");
  if (!Array.isArray(data)) throw new Error("The services response was not valid.");
  return data;
}
export async function getService(id: string) {
  const response = await fetch(`/api/services/${encodeURIComponent(id)}`, { cache: "no-store" });
  const data = await response.json() as Service | { message?: string };
  if (!response.ok) throw new Error((data as { message?: string }).message || "This service is unavailable.");
  return data as Service;
}
export async function createService(input: CreateServiceInput) { const { data } = await api.post<Service>("/services", input); return data; }
export async function updateService(id: string, input: Partial<Service>) { const { data } = await api.patch<Service>(`/services/${encodeURIComponent(id)}`, input); return data; }
export async function deleteService(id: string) { await api.delete(`/services/${encodeURIComponent(id)}`); }
