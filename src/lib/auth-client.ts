import { createAuthClient } from "better-auth/react";

// Better Auth's API handler is mounted on this same Next.js app at /api/auth.
// Keep the client URL-relative so production deployments use their current
// domain instead of a stale localhost or cross-origin environment value.
export const authClient = createAuthClient();
