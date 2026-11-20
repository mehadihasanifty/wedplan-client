import { NextResponse } from "next/server";

// Dashboard layouts resolve the Better Auth session and role. Keeping this
// proxy database-free avoids turning RSC navigations into proxy 500 responses.
// Protected data remains authorized by the Express API on every request.
export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
