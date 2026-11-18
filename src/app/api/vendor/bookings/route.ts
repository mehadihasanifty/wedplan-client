import { ObjectId } from "mongodb";
import { auth, authDb } from "@/lib/auth";

function idOptions(id: string) {
  const options: (string | ObjectId)[] = [id];
  if (ObjectId.isValid(id) && new ObjectId(id).toHexString() === id.toLowerCase()) options.push(new ObjectId(id));
  return options;
}

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ message: "Sign in to view booking requests." }, { status: 401 });
  if (session.user.role !== "vendor") return Response.json({ message: "Only vendors can view vendor booking requests." }, { status: 403 });

  const limitParam = Number(new URL(request.url).searchParams.get("limit")) || 100;
  const bookings = await authDb.collection("bookings")
    .find({ vendorId: { $in: idOptions(session.user.id) } } as never)
    .sort({ createdAt: -1 })
    .limit(Math.max(1, Math.min(limitParam, 100)))
    .toArray();

  const services = authDb.collection("services");
  const users = authDb.collection("user");
  const enriched = await Promise.all(bookings.map(async (booking) => {
    const serviceId = booking.serviceId ? String(booking.serviceId) : "";
    const service = serviceId ? await services.findOne({ _id: { $in: idOptions(serviceId) } } as never) : null;
    const customerId = booking.customerId ? String(booking.customerId) : "";
    const customer = customerId
      ? await users.findOne({ _id: { $in: idOptions(customerId) } } as never, { projection: { name: 1, email: 1, image: 1 } })
      : null;
    return { ...booking, service: service ?? booking.service ?? null, customer: customer ?? booking.customer ?? null };
  }));

  return Response.json(enriched);
}
