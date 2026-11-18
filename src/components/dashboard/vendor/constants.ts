export const serviceCategories = ["Photography & Videography", "Wedding Venues", "Decoration & Florist", "Catering Services", "Makeup & Styling", "Wedding Fashion"] as const;

export function serviceId(service: { id?: string; _id?: string }) {
  return service.id ?? service._id ?? "";
}

export function belongsToVendor(service: { vendorId?: string; vendor?: { id?: string; _id?: string } }, vendorId: string) {
  return service.vendorId === vendorId || service.vendor?.id === vendorId || service.vendor?._id === vendorId;
}

export function formatCurrency(amount: number, currency = "USD") {
  try { return new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount); }
  catch { return `${currency} ${amount.toLocaleString("en")}`; }
}
