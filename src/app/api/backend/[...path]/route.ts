import { NextRequest } from "next/server";
import { normalizeApiBase } from "@/lib/api-base";

const apiBase = normalizeApiBase(
  process.env.WEDPLAN_API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL,
);

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxyBackendRequest(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { path } = await context.params;
    const resourcePath = path.map((segment) => encodeURIComponent(segment)).join("/");
    const url = `${apiBase}/${resourcePath}${request.nextUrl.search}`;
    const headers = new Headers();

    for (const name of [
      "accept",
      "authorization",
      "content-type",
      "cookie",
      "origin",
    ]) {
      const value = request.headers.get(name);
      if (value) headers.set(name, value);
    }

    const hasBody = !["GET", "HEAD"].includes(request.method);
    const upstream = await fetch(url, {
      method: request.method,
      headers,
      ...(hasBody ? { body: await request.arrayBuffer() } : {}),
      cache: "no-store",
      signal: request.signal,
    });
    const responseHeaders = new Headers();
    for (const name of ["cache-control", "content-type", "retry-after"]) {
      const value = upstream.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }
    responseHeaders.set("Cache-Control", "no-store");

    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    return Response.json(
      { message: "The WedPlan API server is unavailable. Please try again." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export function GET(request: NextRequest, context: RouteContext) {
  return proxyBackendRequest(request, context);
}

export function POST(request: NextRequest, context: RouteContext) {
  return proxyBackendRequest(request, context);
}

export function PATCH(request: NextRequest, context: RouteContext) {
  return proxyBackendRequest(request, context);
}

export function PUT(request: NextRequest, context: RouteContext) {
  return proxyBackendRequest(request, context);
}

export function DELETE(request: NextRequest, context: RouteContext) {
  return proxyBackendRequest(request, context);
}
