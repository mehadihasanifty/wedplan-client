import { authDb } from "@/lib/auth";
import { idOptions, requireAdmin } from "@/lib/admin-api";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const access = await requireAdmin(request);
  if (access.response) return access.response;
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as {
    status?: string;
  } | null;
  if (
    !body?.status ||
    !["pending", "approved", "rejected"].includes(body.status)
  ) {
    return Response.json(
      { message: "Choose pending, approved, or rejected." },
      { status: 400 },
    );
  }

  const services = authDb.collection("services");
  const current = await services.findOne({
    _id: { $in: idOptions(id) },
  } as never);
  if (!current)
    return Response.json({ message: "Service not found." }, { status: 404 });
  const status = body.status as "pending" | "approved" | "rejected";
  if (status === "approved") {
    const vendorId = current.vendorId ? String(current.vendorId) : "";
    if (!vendorId) {
      return Response.json(
        { message: "This service has no vendor reference and cannot be approved." },
        { status: 409 },
      );
    }
    const vendor = await authDb
      .collection("user")
      .findOne({ _id: { $in: idOptions(vendorId) } } as never, {
        projection: { subscriptionPlan: 1 },
      });
    if (!vendor) {
      return Response.json(
        { message: "The service vendor could not be found." },
        { status: 409 },
      );
    }
    const premium = ["premium", "pro"].includes(
      String(vendor.subscriptionPlan || "").toLowerCase(),
    );
    if (!premium) {
      const activeCount = await services.countDocuments({
        vendorId: { $in: idOptions(vendorId) },
        status: "approved",
        isActive: true,
        _id: { $ne: current._id },
      } as never);
      if (activeCount >= 3) {
        return Response.json(
          {
            message:
              "This vendor has reached the Free plan limit of 3 active services.",
          },
          { status: 409 },
        );
      }
    }
  }
  const update: Record<string, unknown> = {
    status,
    moderatedAt: new Date(),
    moderatedBy: access.session.user.id,
  };
  if (status !== "approved") update.isActive = false;
  else if (typeof current.isActive !== "boolean") update.isActive = true;

  await services.updateOne({ _id: current._id } as never, { $set: update });
  const updated = await services.findOne({ _id: current._id } as never);
  return Response.json(updated);
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const access = await requireAdmin(request);
  if (access.response) return access.response;
  const { id } = await context.params;
  const result = await authDb
    .collection("services")
    .deleteOne({ _id: { $in: idOptions(id) } } as never);
  if (!result.deletedCount)
    return Response.json({ message: "Service not found." }, { status: 404 });
  return Response.json({ deleted: true });
}
