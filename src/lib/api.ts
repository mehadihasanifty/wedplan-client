import axios from "axios";
export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api", withCredentials: true, headers: { "Content-Type": "application/json" } });

let tokenRefresh: Promise<void> | null = null;

api.interceptors.response.use(undefined, async (error) => {
  const request = error.config as (typeof error.config & { _jwtRetried?: boolean }) | undefined;
  const status = error.response?.status;
  const url = String(request?.url || "");
  if (!request || status !== 401 || request._jwtRetried || /\/auth\/token(?:\?|$)/.test(url)) throw error;

  request._jwtRetried = true;
  tokenRefresh ??= fetch(`${api.defaults.baseURL}/auth/token`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" } })
    .then(async (response) => {
      if (!response.ok) throw new Error("Your WedPlan session has expired. Please sign in again.");
    })
    .finally(() => { tokenRefresh = null; });

  await tokenRefresh;
  return api(request);
});
