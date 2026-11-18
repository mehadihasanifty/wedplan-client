import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient, ObjectId } from "mongodb";

const mongoUrl = process.env.MONGODB_URL?.trim();
if (!mongoUrl) {
  throw new Error("MONGODB_URL must be set to enable authentication.");
}

const globalForMongo = globalThis as typeof globalThis & {
  wedPlanMongoClient?: MongoClient;
};

const mongoClient = globalForMongo.wedPlanMongoClient ?? new MongoClient(mongoUrl);
if (process.env.NODE_ENV !== "production") {
  globalForMongo.wedPlanMongoClient = mongoClient;
}

export const authDb = mongoClient.db();

function idOptions(id: string) {
  const options: (string | ObjectId)[] = [id];
  if (ObjectId.isValid(id) && new ObjectId(id).toHexString() === id.toLowerCase()) options.push(new ObjectId(id));
  return options;
}

export const auth = betterAuth({
  appName: "WedPlan",
  baseURL: process.env.BETTER_AUTH_URL?.trim() || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(authDb, { client: mongoClient }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
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
      blocked: {
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
            throw new APIError("BAD_REQUEST", { message: "Public accounts can only be customers or vendors." });
          }
          return { data: { ...user, role } };
        },
      },
      update: {
        before: async (user) => {
          if ("role" in user || "subscriptionPlan" in user || "blocked" in user) {
            throw new APIError("FORBIDDEN", { message: "Account role, access, and subscription settings cannot be changed from profile updates." });
          }
          return { data: user };
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const user = await authDb.collection("user").findOne({ _id: { $in: idOptions(session.userId) } } as never);
          if (user?.blocked === true) {
            throw new APIError("FORBIDDEN", { message: "This account is blocked. Contact WedPlan support." });
          }
          return { data: session };
        },
      },
    },
  },
});
