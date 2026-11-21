import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { normalizeApiBase } from "@/lib/api-base";

const apiBase = normalizeApiBase(
  process.env.WEDPLAN_API_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL,
);

function cookieHeaderWithAccessToken(
  currentCookieHeader: string,
  setCookieHeaders: string[],
) {
  const cookieValues = new Map<string, string>();
  for (const part of currentCookieHeader.split(";")) {
    const separator = part.indexOf("=");
    if (separator > 0) {
      cookieValues.set(part.slice(0, separator).trim(), part.slice(separator + 1).trim());
    }
  }

  for (const setCookie of setCookieHeaders) {
    const pair = setCookie.split(";", 1)[0];
    const separator = pair.indexOf("=");
    if (separator > 0) {
      cookieValues.set(pair.slice(0, separator).trim(), pair.slice(separator + 1).trim());
    }
  }

  return [...cookieValues].map(([name, value]) => `${name}=${value}`).join("; ");
}

function getSetCookieHeaders(headers: Headers) {
  const extendedHeaders = headers as Headers & { getSetCookie?: () => string[] };
  if (extendedHeaders.getSetCookie) return extendedHeaders.getSetCookie();
  const setCookie = headers.get("set-cookie");
  return setCookie ? [setCookie] : [];
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as { plan?: unknown };
    const allowedPlans = ["premium", "premium_plus", "premium_pro"] as const;
    const plan = allowedPlans.includes(body.plan as (typeof allowedPlans)[number])
      ? (body.plan as (typeof allowedPlans)[number])
      : "premium";
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json(
        { message: "Sign in as a vendor to start Premium checkout." },
        { status: 401 },
      );
    }
    if (session.user.role !== "vendor") {
      return NextResponse.json(
        { message: "Only vendors can start Premium checkout." },
        { status: 403 },
      );
    }

    const configuredOrigin =
      process.env.NEXT_PUBLIC_APP_URL?.trim() ||
      process.env.BETTER_AUTH_URL?.trim() ||
      request.nextUrl.origin;
    const origin = new URL(configuredOrigin).origin;
    const requestOrigin = request.headers.get("origin");
    if (requestOrigin && new URL(requestOrigin).origin !== origin) {
      return NextResponse.json(
        { message: "This checkout request did not come from the WedPlan site." },
        { status: 403 },
      );
    }
    const requestCookies = request.headers.get("cookie") || "";
    const tokenResponse = await fetch(`${apiBase}/auth/token`, {
      method: "POST",
      headers: { cookie: requestCookies, origin },
      cache: "no-store",
    });
    const tokenSetCookies = getSetCookieHeaders(tokenResponse.headers);
    const tokenBody = (await tokenResponse.json().catch(() => ({}))) as {
      message?: string;
    };

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { message: tokenBody.message || "Could not establish a secure payment session." },
        { status: tokenResponse.status },
      );
    }

    const checkoutResponse = await fetch(
      `${apiBase}/payments/create-checkout-session`,
      {
        method: "POST",
        headers: {
          cookie: cookieHeaderWithAccessToken(requestCookies, tokenSetCookies),
          origin,
          "content-type": "application/json",
        },
        body: JSON.stringify({ plan }),
        cache: "no-store",
      },
    );
    const checkoutBody = (await checkoutResponse.json().catch(() => ({}))) as {
      url?: string;
      message?: string;
    };
    const response = NextResponse.json(
      checkoutResponse.ok
        ? checkoutBody
        : { message: checkoutBody.message || "Could not start secure Stripe checkout." },
      { status: checkoutResponse.status },
    );
    response.headers.set("Cache-Control", "no-store");
    for (const setCookie of tokenSetCookies) {
      response.headers.append("Set-Cookie", setCookie);
    }
    return response;
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "The payment service is temporarily unavailable. Please try again.";
    return NextResponse.json({ message }, { status: 503 });
  }
}
