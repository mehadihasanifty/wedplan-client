import { ObjectId } from "mongodb";
import { authDb } from "@/lib/auth";

function idOptions(id: string) {
  const options: (string | ObjectId)[] = [id];
  if (ObjectId.isValid(id) && new ObjectId(id).toHexString() === id.toLowerCase()) options.push(new ObjectId(id));
  return options;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search")?.trim().slice(0, 100);
  const category = url.searchParams.get("category")?.trim();
  const location = url.searchParams.get("location")?.trim();
  const filter: Record<string, unknown> = { status: "approved", isActive: true };
  if (category) filter.category = category;
  if (location) filter.location = location;
  if (search) filter.serviceName = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };

  const limitParam = Number(url.searchParams.get("limit")) || 100;
  const services = await authDb.collection("services").find(filter).sort({ createdAt: -1 }).limit(Math.max(1, Math.min(limitParam, 100))).toArray();
  const users = authDb.collection("user");
  const enriched = await Promise.all(services.map(async (service) => {
    const vendorId = service.vendorId ? String(service.vendorId) : "";
    const vendor = vendorId
      ? await users.findOne({ _id: { $in: idOptions(vendorId) } } as never, { projection: { name: 1, email: 1, image: 1, businessName: 1 } })
      : null;
    return { ...service, vendor: vendor ?? service.vendor ?? null };
  }));
  return Response.json(enriched);
}
