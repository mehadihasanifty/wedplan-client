import { ObjectId } from "mongodb";
import { auth, authDb } from "@/lib/auth";

function idOptions(id: string) {
  const options: (string | ObjectId)[] = [id];
  if (ObjectId.isValid(id) && new ObjectId(id).toHexString() === id.toLowerCase()) {
    options.push(new ObjectId(id));
  }
  return options;
}

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ message: "Sign in to view your bookings." }, { status: 401 });
  if (session.user.role !== "customer") {
    return Response.json({ message: "Only customer accounts can view customer bookings." }, { status: 403 });
  }

  const limitParam = Number(new URL(request.url).searchParams.get("limit")) || 100;
  const limit = Math.max(1, Math.min(limitParam, 100));
  const bookings = await authDb
    .collection("bookings")
    .find({ customerId: session.user.id })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  const services = authDb.collection("services");
  const users = authDb.collection("user");
  const enriched = await Promise.all(bookings.map(async (booking) => {
    const serviceId = booking.serviceId ? String(booking.serviceId) : "";
    const service = serviceId
      ? await services.findOne({ _id: { $in: idOptions(serviceId) } } as never)
      : null;
    const vendorId = String(booking.vendorId ?? service?.vendorId ?? "");
    const vendor = vendorId
      ? await users.findOne({ _id: { $in: idOptions(vendorId) } } as never, { projection: { name: 1, email: 1, image: 1, businessName: 1 } })
      : null;

    return {
      ...booking,
      service: service ? { ...service, vendor: vendor ?? service.vendor ?? null } : booking.service ?? null,
      vendor: vendor ?? booking.vendor ?? null,
    };
  }));

  return Response.json(enriched);
}
