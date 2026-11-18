import { api } from "@/lib/api";
import type { Service } from "@/types";
export async function getServices(params?: Record<string, string | number | undefined>) { const { data } = await api.get<Service[]>("/services", { params }); return data; }
export async function getService(id: string) { const { data } = await api.get<Service>(`/services/${encodeURIComponent(id)}`); return data; }
