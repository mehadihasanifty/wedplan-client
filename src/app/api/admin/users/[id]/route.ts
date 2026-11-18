import { authDb } from "@/lib/auth";
import { idOptions, requireAdmin } from "@/lib/admin-api";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const access = await requireAdmin(request);
  if (access.response) return access.response;
  const { id } = await context.params;
  if (id === access.session.user.id) {
    return Response.json({ message: "You can’t block your own admin account." }, { status: 400 });
  }

  const body = await request.json().catch(() => null) as { blocked?: boolean } | null;
  if (typeof body?.blocked !== "boolean") {
    return Response.json({ message: "Provide blocked as true or false." }, { status: 400 });
  }

  const users = authDb.collection("user");
  const target = await users.findOne({ _id: { $in: idOptions(id) } } as never);
  if (!target) return Response.json({ message: "User not found." }, { status: 404 });
  if (target.role === "admin") return Response.json({ message: "Admin accounts can’t be blocked from this screen." }, { status: 403 });

  await users.updateOne({ _id: target._id } as never, { $set: { blocked: body.blocked, updatedAt: new Date() } });
  if (body.blocked) {
    await authDb.collection("session").deleteMany({ userId: { $in: idOptions(id) } } as never);
  }

  return Response.json({ id, blocked: body.blocked });
}
