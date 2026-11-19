import { ObjectId } from "mongodb";
import { auth, authDb } from "@/lib/auth";

function idOptions(id: string) {
  const options: (string | ObjectId)[] = [id];
  if (
    ObjectId.isValid(id) &&
    new ObjectId(id).toHexString() === id.toLowerCase()
  )
    options.push(new ObjectId(id));
  return options;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session)
    return Response.json(
      { message: "Sign in to manage booking requests." },
      { status: 401 },
    );
  if (session.user.role !== "vendor")
    return Response.json(
      { message: "Only vendors can manage booking requests." },
      { status: 403 },
    );

  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as {
    status?: string;
  } | null;
  if (body?.status !== "accepted" && body?.status !== "rejected") {
    return Response.json(
      { message: "Choose accepted or rejected." },
      { status: 400 },
    );
  }

  const result = await authDb.collection("bookings").updateOne(
    {
      _id: { $in: idOptions(id) },
      vendorId: { $in: idOptions(session.user.id) },
      status: "pending",
    } as never,
    { $set: { status: body.status, updatedAt: new Date() } },
  );
  if (result.matchedCount === 0) {
    return Response.json(
      {
        message:
          "This request does not belong to your account or is no longer pending.",
      },
      { status: 409 },
    );
  }

  const updated = await authDb
    .collection("bookings")
    .findOne({ _id: { $in: idOptions(id) } } as never);
  return Response.json(updated);
}
