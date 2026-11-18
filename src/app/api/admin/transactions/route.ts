import { authDb } from "@/lib/auth";
import { idOptions, requireAdmin } from "@/lib/admin-api";

export async function GET(request: Request) {
  const access = await requireAdmin(request);
  if (access.response) return access.response;
  const transactions = await authDb.collection("transactions").find({}).project({ vendorId: 1, vendor: 1, plan: 1, planName: 1, subscriptionPlan: 1, amount: 1, paymentAmount: 1, amountCents: 1, currency: 1, status: 1, paymentStatus: 1, createdAt: 1, transactionDate: 1 }).sort({ createdAt: -1 }).limit(300).toArray();
  const users = authDb.collection("user");
  const enriched = await Promise.all(transactions.map(async (transaction) => {
    const vendorId = transaction.vendorId ? String(transaction.vendorId) : "";
    const vendor = vendorId ? await users.findOne({ _id: { $in: idOptions(vendorId) } } as never, { projection: { name: 1, email: 1, businessName: 1 } }) : null;
    return { ...transaction, vendor: vendor ?? transaction.vendor ?? null };
  }));
  return Response.json(enriched);
}
