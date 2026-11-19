import { authDb } from "@/lib/auth";
import { requireAdmin } from "@/lib/admin-api";

export async function GET(request: Request) {
  const access = await requireAdmin(request);
  if (access.response) return access.response;

  const users = authDb.collection("user");
  const services = authDb.collection("services");
  const transactions = authDb.collection("transactions");
  const [
    totalUsers,
    vendors,
    customers,
    totalServices,
    pendingServices,
    totalTransactions,
  ] = await Promise.all([
    users.countDocuments(),
    users.countDocuments({ role: "vendor" }),
    users.countDocuments({ role: "customer" }),
    services.countDocuments(),
    services.countDocuments({
      $or: [{ status: "pending" }, { status: { $exists: false } }],
    }),
    transactions.countDocuments(),
  ]);

  return Response.json({
    totalUsers,
    vendors,
    customers,
    totalServices,
    pendingServices,
    totalTransactions,
  });
}
