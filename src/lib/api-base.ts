const DEFAULT_API_BASE = "http://localhost:5000/api";

export function normalizeApiBase(value?: string) {
  const base = (value?.trim() || DEFAULT_API_BASE).replace(/\/+$/, "");
  return /\/api$/i.test(base) ? base : `${base}/api`;
}
