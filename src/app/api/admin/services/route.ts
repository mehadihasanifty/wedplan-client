import { authDb } from "@/lib/auth";
import { escapeRegex, idOptions, requireAdmin } from "@/lib/admin-api";

export async function GET(request: Request) {
  const access = await requireAdmin(request);
  if (access.response) return access.response;
  const url = new URL(request.url);
  const search = url.searchParams.get("search")?.trim().slice(0, 100) ?? "";
  const status = url.searchParams.get("status") ?? "all";
  const clauses: Record<string, unknown>[] = [];
  if (status === "pending")
    clauses.push({
      $or: [{ status: "pending" }, { status: { $exists: false } }],
    });
  else if (["approved", "rejected"].includes(status)) clauses.push({ status });
  if (search) {
    const matcher = new RegExp(escapeRegex(search), "i");
    clauses.push({
      $or: [
        { serviceName: matcher },
        { category: matcher },
        { location: matcher },
      ],
    });
  }
  const filter = clauses.length ? { $and: clauses } : {};
  const services = await authDb
    .collection("services")
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(300)
    .toArray();
  const users = authDb.collection("user");
  const enriched = await Promise.all(
    services.map(async (service) => {
      const vendorId = service.vendorId ? String(service.vendorId) : "";
      const vendor = vendorId
        ? await users.findOne({ _id: { $in: idOptions(vendorId) } } as never, {
            projection: { name: 1, email: 1, businessName: 1 },
          })
        : null;
      return { ...service, vendor: vendor ?? service.vendor ?? null };
    }),
  );
  return Response.json(enriched);
}
