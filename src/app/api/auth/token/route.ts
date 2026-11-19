import type { NextRequest } from "next/server";

const apiBase = (process.env.WEDPLAN_API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

async function proxyTokenRequest(request: NextRequest, method: "POST" | "DELETE") {
  const headers = new Headers();
  const cookie = request.headers.get("cookie");
  const origin = request.headers.get("origin");
  if (cookie) headers.set("cookie", cookie);
  if (origin) headers.set("origin", origin);
  if (method === "POST") headers.set("content-type", "application/json");

  try {
    const upstream = await fetch(`${apiBase}/auth/token`, { method, headers, cache: "no-store" });
    const responseHeaders = new Headers();
    for (const key of ["content-type", "cache-control"]) {
      const value = upstream.headers.get(key);
      if (value) responseHeaders.set(key, value);
    }

    const upstreamHeaders = upstream.headers as Headers & { getSetCookie?: () => string[] };
    const cookies = upstreamHeaders.getSetCookie?.() ?? (upstream.headers.get("set-cookie") ? [upstream.headers.get("set-cookie")!] : []);
    for (const value of cookies) responseHeaders.append("set-cookie", value);
    return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
  } catch {
    return Response.json({ message: "The WedPlan API server is unavailable. Start the server and try again." }, { status: 503 });
  }
}

export function POST(request: NextRequest) {
  return proxyTokenRequest(request, "POST");
}

export function DELETE(request: NextRequest) {
  return proxyTokenRequest(request, "DELETE");
}
