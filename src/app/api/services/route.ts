import { ObjectId } from "mongodb";
import { authDb } from "@/lib/auth";

function idOptions(id: string) {
  const options: (string | ObjectId)[] = [id];
  if (ObjectId.isValid(id) && new ObjectId(id).toHexString() === id.toLowerCase()) {
    options.push(new ObjectId(id));
  }
  return options;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search")?.trim().slice(0, 100) ?? "";
  const category = url.searchParams.get("category")?.trim();
  const location = url.searchParams.get("location")?.trim();
  const sort = url.searchParams.get("sort") ?? "newest";
  const filter: Record<string, unknown> = { status: "approved", isActive: true };

  if (category) filter.category = category;
  if (location) filter.location = { $regex: escapeRegex(location), $options: "i" };

  if (search) {
    const matcher = { $regex: escapeRegex(search), $options: "i" };
    const matchingVendors = await authDb.collection("user")
      .find({ $or: [{ name: matcher }, { businessName: matcher }] }, { projection: { _id: 1 } })
      .limit(100)
      .toArray();
    const vendorIds = matchingVendors.flatMap((vendor) => idOptions(String(vendor._id)));
    const alternatives: Record<string, unknown>[] = ["serviceName", "category", "description", "location"]
      .map((field) => ({ [field]: matcher }));
    if (vendorIds.length) alternatives.push({ vendorId: { $in: vendorIds } });
    filter.$or = alternatives;
  }

  const sortSpec: Record<string, 1 | -1> = ["low", "price-asc"].includes(sort)
    ? { price: 1, _id: 1 }
    : ["high", "price-desc"].includes(sort)
      ? { price: -1, _id: 1 }
      : { createdAt: -1, _id: -1 };
  const limit = Math.max(1, Math.min(Number(url.searchParams.get("limit")) || 100, 100));
  const services = await authDb.collection("services").find(filter).sort(sortSpec).limit(limit).toArray();
  const users = authDb.collection("user");
  const enriched = await Promise.all(services.map(async (service) => {
    const vendorId = service.vendorId ? String(service.vendorId) : "";
    const vendor = vendorId
      ? await users.findOne({ _id: { $in: idOptions(vendorId) } } as never, { projection: { name: 1, email: 1, image: 1, businessName: 1 } })
      : null;
    return { ...service, vendor: vendor ?? null };
  }));

  return Response.json(enriched);
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
