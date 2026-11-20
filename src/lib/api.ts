import axios from "axios";

export const api = axios.create({
  // Keep API requests on the client host so its HttpOnly JWT cookie can be
  // forwarded by the same-origin backend proxy to the Express server.
  baseURL: "/api/backend",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let tokenRefresh: Promise<void> | null = null;

function throwApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const responseMessage = (
      error.response?.data as { message?: unknown } | undefined
    )?.message;
    if (typeof responseMessage === "string" && responseMessage.trim()) {
      error.message = responseMessage;
    }
  }
  throw error;
}

api.interceptors.response.use(undefined, async (error: unknown) => {
  if (!axios.isAxiosError(error)) throw error;
  const request = error.config as
    (typeof error.config & { _jwtRetried?: boolean }) | undefined;
  const status = error.response?.status;
  const url = String(request?.url || "");
  if (
    !request ||
    status !== 401 ||
    request._jwtRetried ||
    /\/auth\/token(?:\?|$)/.test(url)
  )
    return throwApiError(error);

  request._jwtRetried = true;
  tokenRefresh ??= fetch("/api/auth/token", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  })
    .then(async (response) => {
      if (!response.ok)
        throw new Error(
          "Your WedPlan session has expired. Please sign in again.",
        );
    })
    .finally(() => {
      tokenRefresh = null;
    });

  await tokenRefresh;
  return api(request);
});
