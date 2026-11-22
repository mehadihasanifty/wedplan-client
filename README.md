# WedPlan — Wedding Planning, Thoughtfully

<p align="center">
  <strong>Discover trusted wedding professionals, plan with confidence, and bring your celebration to life.</strong>
</p>

<p align="center">
  <a href="https://nextjs.org"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs"></a>
  <a href="https://react.dev"><img alt="React" src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white"></a>
  <a href="https://www.typescriptlang.org"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white"></a>
</p>

## Project Overview

WedPlan is the client-side web application for a wedding planning marketplace. Customers can browse wedding services and request bookings. Vendors can publish and manage listings, respond to booking requests, and upgrade their subscription. Administrators can manage users and review services and transactions.

**Live website:** [Open WedPlan](https://wedplan-client-mfh52bneo-mehedi-hasan13.vercel.app)

## Important Features

- Responsive wedding-themed homepage and service discovery experience.
- Search and filter services by name, category, and location; sort by price.
- Service detail pages with images, vendor information, and booking requests.
- Better Auth email/password authentication and Google sign-in, with role-aware customer, vendor, and admin dashboards.
- Vendor service management, approval status, booking-request tools, and subscription checkout.
- Customer booking history and booking-status tracking.
- Admin user and service management, plus read-only transaction monitoring.
- Stripe Checkout flow with payment confirmation handled by the server webhook.
- ImgBB image uploads, loading and error states, and toast notifications.

## Technology Stack

| Area | Technologies |
| --- | --- |
| Framework | Next.js 16 App Router, React 19, TypeScript |
| Styling and UI | Tailwind CSS 4, ShadCN-based components, Lucide icons |
| Authentication and data | Better Auth, MongoDB |
| API | WedPlan Express.js server |
| Payments and uploads | Stripe Checkout, ImgBB |
| Animation | Framer Motion |

## Installation

### Prerequisites

- Node.js 20 or newer and npm.
- The [WedPlan API server](https://github.com/mehadihasanifty/wedplan-server) running locally or deployed.
- MongoDB Atlas (or another reachable MongoDB deployment), plus credentials for the services you enable.

### Get the client code

```bash
git clone https://github.com/mehadihasanifty/wedplan-client.git
cd wedplan-client
npm install
```

Create a `.env.local` file in the client project root. Keep it private and never commit it:

```dotenv
MONGODB_URL="your-mongodb-connection-string"
BETTER_AUTH_SECRET="a-long-random-secret-shared-with-the-api-server"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
WEDPLAN_API_INTERNAL_URL="http://localhost:5000/api"

# Optional: enable Google sign-in
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"

# Required for profile and service image uploads
IMGBB_API_KEY="your-imgbb-api-key"
```

Use the same `MONGODB_URL` and `BETTER_AUTH_SECRET` in the client and API server. Configure the API server’s own environment file for its MongoDB, JWT, CORS, and Stripe settings. **Never put secret keys in `NEXT_PUBLIC_*` variables or commit environment files.**

## Run Locally

Start the API server in one terminal:

```bash
cd path/to/wedplan-server
npm install
npm run dev
```

Start the client in a second terminal:

```bash
cd path/to/wedplan-client
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The API health endpoint should respond at [http://localhost:5000/api/health](http://localhost:5000/api/health).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create an optimized production build. |
| `npm run start` | Serve the production build locally. |
| `npm run lint` | Run ESLint. |

## Deployment Notes

Set the client environment variables in the hosting provider and use the deployed client URL for `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL`. Set the API URL to the deployed WedPlan server. Add the deployed client origin to the API server’s CORS and Better Auth trusted-origin configuration. Configure Google OAuth callback URLs and Stripe webhook settings for the deployed domains. Redeploy after changing environment variables.

Keep `.env.local` and all credentials out of Git. The repository ignores `.env*` files by default.
