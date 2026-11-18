import { ObjectId } from "mongodb";
import { authDb } from "@/lib/auth";

function idOptions(id: string) {
  const options: (string | ObjectId)[] = [id];
  if (ObjectId.isValid(id) && new ObjectId(id).toHexString() === id.toLowerCase()) options.push(new ObjectId(id));
  return options;
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const service = await authDb.collection("services").findOne({
    _id: { $in: idOptions(id) },
    status: "approved",
    isActive: true,
  } as never);
  if (!service) return Response.json({ message: "This service is not available." }, { status: 404 });

  const vendorId = service.vendorId ? String(service.vendorId) : "";
  const vendor = vendorId
    ? await authDb.collection("user").findOne({ _id: { $in: idOptions(vendorId) } } as never, { projection: { name: 1, email: 1, image: 1, businessName: 1 } })
    : null;
  return Response.json({ ...service, vendor: vendor ?? service.vendor ?? null });
}
