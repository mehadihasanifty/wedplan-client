export async function syncApiToken() {
  const response = await fetch("/api/auth/token", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, cache: "no-store" });
  const result = await response.json().catch(() => ({})) as { message?: string };
  if (!response.ok) throw new Error(result.message || "Could not establish a secure API session. Please sign in again.");
}

export async function clearApiToken() {
  const response = await fetch("/api/auth/token", { method: "DELETE", credentials: "same-origin", cache: "no-store" });
  if (!response.ok) throw new Error("Could not clear the API session.");
}
