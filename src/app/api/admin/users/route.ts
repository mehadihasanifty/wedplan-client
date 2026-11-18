import { authDb } from "@/lib/auth";
import { escapeRegex, requireAdmin } from "@/lib/admin-api";

export async function GET(request: Request) {
  const access = await requireAdmin(request);
  if (access.response) return access.response;
  const url = new URL(request.url);
  const search = url.searchParams.get("search")?.trim().slice(0, 100) ?? "";
  const role = url.searchParams.get("role") ?? "all";
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const limit = 20;
  const filter: Record<string, unknown> = {};
  if (["admin", "vendor", "customer"].includes(role)) filter.role = role;
  if (search) {
    const matcher = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ name: matcher }, { email: matcher }];
  }
  const collection = authDb.collection("user");
  const [users, total] = await Promise.all([
    collection.find(filter).project({ name: 1, email: 1, role: 1, image: 1, blocked: 1, createdAt: 1, businessName: 1 }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
    collection.countDocuments(filter),
  ]);
  return Response.json({ users, total, page, limit });
}
