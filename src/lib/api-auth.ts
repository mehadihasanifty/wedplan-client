const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function syncApiToken() {
  const response = await fetch(`${apiBase}/auth/token`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" } });
  const result = await response.json().catch(() => ({})) as { message?: string };
  if (!response.ok) throw new Error(result.message || "Could not establish a secure API session. Please sign in again.");
}

export async function clearApiToken() {
  const response = await fetch(`${apiBase}/auth/token`, { method: "DELETE", credentials: "include" });
  if (!response.ok) throw new Error("Could not clear the API session.");
}
