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
      service: service ? { ...service, vendor } : null,
      vendor: vendor ?? null,
    };
  }));

  return Response.json(enriched);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ message: "Sign in with a customer account to request a booking." }, { status: 401 });
  if (session.user.role !== "customer") {
    return Response.json({ message: "Only customer accounts can send booking requests." }, { status: 403 });
  }

  const body = await request.json().catch(() => null) as {
    serviceId?: unknown;
    eventDate?: unknown;
    eventLocation?: unknown;
    message?: unknown;
  } | null;
  const serviceId = typeof body?.serviceId === "string" ? body.serviceId.trim() : "";
  const eventDate = typeof body?.eventDate === "string" ? body.eventDate.trim() : "";
  const eventLocation = typeof body?.eventLocation === "string" ? body.eventLocation.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(eventDate) ? new Date(`${eventDate}T00:00:00.000Z`) : null;
  const validDate = Boolean(parsedDate && !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === eventDate);
  const today = new Date().toISOString().slice(0, 10);

  if (!serviceId || serviceId.length > 100 || !validDate || eventDate < today || !eventLocation || eventLocation.length > 200 || message.length > 2000) {
    return Response.json({ message: "Choose today or a future event date and enter a location. The location can be up to 200 characters and the message up to 2,000 characters." }, { status: 400 });
  }

  const service = await authDb.collection("services").findOne({
    _id: { $in: idOptions(serviceId) },
    status: "approved",
    isActive: true,
  } as never);
  if (!service) return Response.json({ message: "This service is no longer available for booking." }, { status: 404 });

  const vendorId = String(service.vendorId ?? service.vendor?.id ?? service.vendor?._id ?? "");
  if (!vendorId) return Response.json({ message: "Vendor details are missing for this service." }, { status: 409 });
  if (vendorId === session.user.id) return Response.json({ message: "You can’t book a service listed by your own vendor account." }, { status: 403 });

  const activeRequest = await authDb.collection("bookings").findOne({
    serviceId: { $in: idOptions(serviceId) },
    eventDate,
    status: { $in: ["pending", "accepted"] },
  } as never);
  if (activeRequest) {
    return Response.json({ message: "There is already an active request for this service on that event date. Choose another date or contact the vendor." }, { status: 409 });
  }

  const booking = {
    serviceId,
    vendorId,
    customerId: session.user.id,
    eventDate,
    eventLocation,
    ...(message ? { message } : {}),
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const result = await authDb.collection("bookings").insertOne(booking);
    return Response.json({ ...booking, _id: result.insertedId }, { status: 201 });
  } catch (cause) {
    if (cause && typeof cause === "object" && "code" in cause && cause.code === 11000) {
      return Response.json({ message: "An active request already exists for this service and event date." }, { status: 409 });
    }
    throw cause;
  }
}
