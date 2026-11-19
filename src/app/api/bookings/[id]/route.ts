import { ObjectId } from "mongodb";
import { auth, authDb } from "@/lib/auth";

function idOptions(id: string) {
  const options: (string | ObjectId)[] = [id];
  if (
    ObjectId.isValid(id) &&
    new ObjectId(id).toHexString() === id.toLowerCase()
  ) {
    options.push(new ObjectId(id));
  }
  return options;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session)
    return Response.json(
      { message: "Sign in to update a booking." },
      { status: 401 },
    );
  if (session.user.role !== "customer") {
    return Response.json(
      { message: "Only customers can cancel their booking requests." },
      { status: 403 },
    );
  }

  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as {
    status?: string;
  } | null;
  if (body?.status !== "cancelled") {
    return Response.json(
      { message: "Customers may only cancel a pending request." },
      { status: 400 },
    );
  }

  const result = await authDb.collection("bookings").updateOne(
    {
      _id: { $in: idOptions(id) },
      customerId: session.user.id,
      status: "pending",
    } as never,
    { $set: { status: "cancelled", updatedAt: new Date() } },
  );

  if (result.matchedCount === 0) {
    return Response.json(
      { message: "This booking is unavailable or is no longer pending." },
      { status: 409 },
    );
  }

  const updatedBooking = await authDb
    .collection("bookings")
    .findOne({ _id: { $in: idOptions(id) } } as never);
  return Response.json(updatedBooking);
}
