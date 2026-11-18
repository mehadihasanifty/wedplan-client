import { api } from "@/lib/api";
import type { Service } from "@/types";
export type CreateServiceInput = Omit<Service, "id" | "_id" | "vendorId" | "vendor"> & { status?: Service["status"] };
export async function getServices(params?: Record<string, string | number | undefined>) { const { data } = await api.get<Service[]>("/services", { params }); return data; }
export async function getPublicServices(params?: Record<string, string | number | undefined>) {
  const { data } = await api.get<Service[]>("/services", { params: { ...params, status: undefined, isActive: undefined } });
  return data;
}
export async function getService(id: string) {
  const { data } = await api.get<Service>(`/services/${encodeURIComponent(id)}`);
  return data;
}
export async function createService(input: CreateServiceInput) { const { data } = await api.post<Service>("/services", input); return data; }
export async function updateService(id: string, input: Partial<Service>) { const { data } = await api.patch<Service>(`/services/${encodeURIComponent(id)}`, input); return data; }
export async function deleteService(id: string) { await api.delete(`/services/${encodeURIComponent(id)}`); }
