import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient, ObjectId } from "mongodb";

function toOrigin(value?: string) {
  const candidate = value?.trim();
  if (!candidate) return undefined;
  if (candidate.includes("*")) return candidate;
  try {
    return new URL(candidate).origin;
  } catch {
    return undefined;
  }
}

const vercelDeploymentURL =
  process.env.VERCEL_ENV === "production"
    ? process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
    : process.env.VERCEL_URL || process.env.VERCEL_BRANCH_URL;
const authBaseURL =
  toOrigin(process.env.NEXT_PUBLIC_APP_URL) ||
  (vercelDeploymentURL ? toOrigin(`https://${vercelDeploymentURL}`) : undefined) ||
  toOrigin(process.env.BETTER_AUTH_URL) ||
  "http://localhost:3000";
const trustedOrigins = [
  authBaseURL,
  toOrigin(process.env.BETTER_AUTH_URL),
  toOrigin(process.env.NEXT_PUBLIC_APP_URL),
  ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS || "")
    .split(",")
    .map(toOrigin),
  ...[
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
  ].map((host) => (host ? toOrigin(`https://${host}`) : undefined)),
].filter((origin): origin is string => Boolean(origin));

const mongoUrl = process.env.MONGODB_URL?.trim();
if (!mongoUrl) {
  throw new Error("MONGODB_URL must be set to enable authentication.");
}

const globalForMongo = globalThis as typeof globalThis & {
  wedPlanMongoClient?: MongoClient;
};

// const mongoClient =
//   globalForMongo.wedPlanMongoClient ?? new MongoClient(mongoUrl);
// if (process.env.NODE_ENV !== "production") {
//   globalForMongo.wedPlanMongoClient = mongoClient;
// }

const mongoClient =
  globalForMongo.wedPlanMongoClient ?? new MongoClient(mongoUrl);

globalForMongo.wedPlanMongoClient = mongoClient;

// Keep Better Auth records beside the rest of WedPlan's MongoDB data.
export const authDb = mongoClient.db("wedding_planning_platform");

function idOptions(id: string) {
  const options: (string | ObjectId)[] = [id];
  if (
    ObjectId.isValid(id) &&
    new ObjectId(id).toHexString() === id.toLowerCase()
  )
    options.push(new ObjectId(id));
  return options;
}

export const auth = betterAuth({
  appName: "WedPlan",
  baseURL: authBaseURL,
  trustedOrigins: [...new Set(trustedOrigins)],
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(authDb, { client: mongoClient }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    // Keep this aligned with the signup form's password rules.
    minPasswordLength: 6,
  },
  user: {
    additionalFields: {
      // Public sign-up may choose a customer or vendor account, never admin.
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },
      businessName: {
        type: "string",
        required: false,
        input: true,
      },
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      subscriptionPlan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false,
      },
      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
      },
      phoneNumber: { type: "string", required: false, input: false },
      location: { type: "string", required: false, input: false },
      bio: { type: "string", required: false, input: false },
    },
  },
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        socialProviders: {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        },
      }
    : {}),
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const role = user.role ?? "customer";
          if (role !== "customer" && role !== "vendor") {
            throw new APIError("BAD_REQUEST", {
              message: "Public accounts can only be customers or vendors.",
            });
          }
          return { data: { ...user, role } };
        },
      },
      update: {
        before: async (user) => {
          if (
            "role" in user ||
            "subscriptionPlan" in user ||
            "subscriptionExpiresAt" in user ||
            "isBlocked" in user ||
            "blocked" in user
          ) {
            throw new APIError("FORBIDDEN", {
              message:
                "Account role, access, and subscription settings cannot be changed from profile updates.",
            });
          }
          return { data: user };
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const user = await authDb
            .collection("user")
            .findOne({ _id: { $in: idOptions(session.userId) } } as never);
          if (user?.isBlocked === true || user?.blocked === true) {
            throw new APIError("FORBIDDEN", {
              message: "This account is blocked. Contact WedPlan support.",
            });
          }
          return { data: session };
        },
      },
    },
  },
});
