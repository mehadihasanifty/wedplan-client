import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

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
        type: ["customer", "vendor"],
        required: false,
        defaultValue: "customer",
        input: true,
      },
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
});
