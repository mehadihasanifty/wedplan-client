import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

type UserRole = "admin" | "vendor" | "customer";
type SessionUser = {
  role?: UserRole | null;
  isBlocked?: boolean | null;
};

const dashboardRoles: Array<{ prefix: string; role: UserRole }> = [
  { prefix: "/dashboard/admin", role: "admin" },
  { prefix: "/dashboard/vendor", role: "vendor" },
  { prefix: "/dashboard/customer", role: "customer" },
];

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const user = session?.user as SessionUser | undefined;
  const signInUrl = new URL("/signin", request.url);

  if (!user) {
    signInUrl.searchParams.set("callbackURL", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (user.isBlocked) {
    signInUrl.searchParams.set("error", "blocked");
    return NextResponse.redirect(signInUrl);
  }

  const requiredRole = dashboardRoles.find(
    ({ prefix }) =>
      request.nextUrl.pathname === prefix ||
      request.nextUrl.pathname.startsWith(`${prefix}/`),
  )?.role;

  if (requiredRole && user.role !== requiredRole) {
    if (user.role && ["admin", "vendor", "customer"].includes(user.role)) {
      return NextResponse.redirect(
        new URL(`/dashboard/${user.role}`, request.url),
      );
    }

    return NextResponse.redirect(
      new URL("/signin?error=invalid-role", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
