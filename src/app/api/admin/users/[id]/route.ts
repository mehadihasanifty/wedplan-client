import { authDb } from "@/lib/auth";
import { idOptions, requireAdmin } from "@/lib/admin-api";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const access = await requireAdmin(request);
  if (access.response) return access.response;
  const { id } = await context.params;
  if (id === access.session.user.id) {
    return Response.json(
      { message: "You can’t block your own admin account." },
      { status: 400 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    isBlocked?: boolean;
  } | null;
  if (typeof body?.isBlocked !== "boolean") {
    return Response.json(
      { message: "Provide isBlocked as true or false." },
      { status: 400 },
    );
  }

  const users = authDb.collection("user");
  const target = await users.findOne({ _id: { $in: idOptions(id) } } as never);
  if (!target)
    return Response.json({ message: "User not found." }, { status: 404 });
  if (target.role === "admin")
    return Response.json(
      { message: "Admin accounts can’t be blocked from this screen." },
      { status: 403 },
    );

  await users.updateOne({ _id: target._id } as never, {
    $set: { isBlocked: body.isBlocked, updatedAt: new Date() },
    $unset: { blocked: "" },
  });
  if (body.isBlocked) {
    await authDb
      .collection("session")
      .deleteMany({ userId: { $in: idOptions(id) } } as never);
  }

  return Response.json({ id, isBlocked: body.isBlocked });
}
