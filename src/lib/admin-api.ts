import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";

export async function requireAdmin(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return { response: Response.json({ message: "Sign in to continue." }, { status: 401 }) };
  }
  if (session.user.role !== "admin") {
    return { response: Response.json({ message: "Admin access is required." }, { status: 403 }) };
  }
  return { session };
}

export function idOptions(id: string) {
  const options: (string | ObjectId)[] = [id];
  if (ObjectId.isValid(id) && new ObjectId(id).toHexString() === id.toLowerCase()) options.push(new ObjectId(id));
  return options;
}

export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
