# WedPlan — Wedding Planning Platform

WedPlan helps couples find wedding professionals and request bookings. Vendors manage service listings, booking requests, and Premium subscriptions. Admins review users, listings, and payment records.

## Features

- Responsive public homepage and searchable service directory with category/location filters and price sorting.
- Service details, ImgBB-hosted images, and customer booking requests.
- Better Auth email/password and Google authentication with Customer, Vendor, and Admin role-aware dashboards.
- Vendor listing management and approval states; public listings show only approved, active services.
- Customer booking management, vendor accept/reject workflow, and admin user/service moderation.
- Stripe Checkout subscription flow with server-verified webhook updates.
- Loading, empty, and error states with toast feedback; animated homepage sections respect reduced-motion preferences.

## Technology

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, ShadCN components, Better Auth, MongoDB, Express.js API, Stripe Checkout, ImgBB, and Framer Motion.

## Repositories and deployment

- Client: [github.com/mehadihasanifty/wedplan-client](https://github.com/mehadihasanifty/wedplan-client)
- Server: [github.com/mehadihasanifty/wedplan-server](https://github.com/mehadihasanifty/wedplan-server)
- Live website: Not deployed yet. Add the deployed URL here before submission.

## Run locally

The client and API server are separate repositories and both need to run.

1. Install Node.js and MongoDB Atlas or a local MongoDB instance.
2. In the client repository, copy `.env.example` to `.env`, fill in the values below, then run:

   ```bash
   npm install
   npm run dev
   ```

3. In the server repository, copy its `.env.example` to `.env`. Use the same `MONGODB_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` as the client, then run:

   ```bash
   npm install
   npm run dev
   ```

4. Open `http://localhost:3000`. The API health endpoint is `http://localhost:5000/api/health`.

## Client environment variables

| Variable | Purpose |
| --- | --- |
| `MONGODB_URL` | MongoDB connection URL used by server-side Better Auth and Next.js routes. Use the same database URL in the Express server. |
| `BETTER_AUTH_SECRET` | Shared Better Auth signing secret. Keep it identical in client and server environments. |
| `BETTER_AUTH_URL` | The client origin, such as `http://localhost:3000`. |
| `NEXT_PUBLIC_API_URL` | Browser-visible Express API base URL, such as `http://localhost:5000/api`; it is not a credential. |
| `IMGBB_API_KEY` | ImgBB key used only by the Next.js image upload route. Do not rename it to a `NEXT_PUBLIC_` variable. |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Optional Google OAuth credentials; keep server-side. |

Set `PORT`, `CLIENT_URL`, `JWT_SECRET`, `JWT_ACCESS_TTL`, and Stripe variables in the server `.env`. Configure a Stripe Test Mode webhook to the server's `/api/payments/webhook` endpoint. See the server README for required Stripe events.

## Deployment checklist

- Set all environment variables in the hosting providers; never upload `.env` files.
- Set the client `BETTER_AUTH_URL` to the deployed client origin and server `CLIENT_URL` to the allowed client origin(s).
- Set `NEXT_PUBLIC_API_URL` to the deployed API base URL and enable credentialed CORS for the client origin.
- Keep MongoDB, Better Auth, Google OAuth, ImgBB, JWT, and Stripe credentials in server-side environment settings. Only the API URL is public.
- Register the production Stripe webhook URL and signing secret; Premium access is granted only after a verified webhook.
- Smoke-test direct navigation/reload for public, auth, payment, and role-protected routes; test signup, bookings, vendor approval, and Stripe Test Mode.
