<div align="center">

# WedPlan

### Wedding planning, thoughtfully.

Discover wedding professionals, coordinate booking requests, and bring every celebration together in one place.

[![Next.js](https://img.shields.io/badge/Next.js-16-111111?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**[Visit the live website](https://wedplan-client-mfh52bneo-mehedi-hasan13.vercel.app)**

</div>

---

## Contents

- [About WedPlan](#about-wedplan)
- [Features](#features)
- [Technology](#technology)
- [Application Areas](#application-areas)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Run Locally](#run-locally)
- [Available Commands](#available-commands)
- [Deployment](#deployment)
- [Security](#security)

## About WedPlan

WedPlan is the **client-side application** for a role-based wedding services marketplace. Couples can discover wedding services and submit booking requests. Vendors can publish listings, manage requests, and choose a subscription plan. Administrators can review platform users, service listings, and payment transactions.

The client is built with the Next.js App Router and communicates with the separate [WedPlan Express API](https://github.com/mehadihasanifty/wedplan-server) for marketplace operations. Better Auth manages authentication, while MongoDB stores authentication and platform data.

## Features

- Wedding-focused landing page with featured services and browsable categories.
- Public service directory with name search, category and location filters, price sorting, and pagination.
- Service detail pages with images, vendor information, and booking requests.
- Email/password and Google sign-in through Better Auth.
- Customer, vendor, and admin dashboard experiences with role-aware navigation.
- Vendor tools for service listings, availability, booking requests, and Premium subscription checkout.
- Customer booking history and booking status tracking.
- Admin tools for user moderation and service review, with transaction records presented as read-only.
- Stripe Checkout, with subscription activation confirmed by the server-side webhook.
- ImgBB image uploads, responsive layouts, loading and error states, and toast notifications.
- Motion effects that respect the user's reduced-motion preference.

## Technology

| Layer | Stack |
| --- | --- |
| Web framework | Next.js 16 App Router, React 19 |
| Language | TypeScript |
| UI and styling | Tailwind CSS 4, ShadCN-based components, Lucide icons |
| Authentication | Better Auth |
| Data | MongoDB through Better Auth and the Express API |
| API integration | WedPlan Express.js server, Fetch, Axios |
| Payments and media | Stripe Checkout, ImgBB |
| Animation | Framer Motion |

## Application Areas

| Role | Main capabilities |
| --- | --- |
| Visitor | Explore the homepage and browse approved, active wedding services. |
| Customer | Request bookings and track or cancel eligible booking requests. |
| Vendor | Manage services and booking requests, and upgrade a subscription. |
| Admin | Manage users and services, and review payment transactions. |

## Getting Started

### Prerequisites

- Node.js 20 or later and npm.
- A MongoDB database reachable by both the client and API server.
- The [WedPlan API server](https://github.com/mehadihasanifty/wedplan-server), running locally or deployed.
- Provider credentials for the features you enable: Better Auth, ImgBB, Google OAuth, and Stripe.

### Clone and install

```bash
git clone https://github.com/mehadihasanifty/wedplan-client.git
cd wedplan-client
npm install
```

Create a `.env.local` file in the project root and configure the variables below. Use your own credentials; do not copy secrets into source code.

## Environment Configuration

| Variable | Required | Purpose |
| --- | :---: | --- |
| `MONGODB_URL` | Yes | MongoDB connection string used by server-side Better Auth. |
| `BETTER_AUTH_SECRET` | Yes | Secret used by Better Auth. Configure the matching value on the API server. |
| `BETTER_AUTH_URL` | Yes | Client application origin, for example `http://localhost:3000`. |
| `NEXT_PUBLIC_API_URL` | Yes | WedPlan API base URL, for example `http://localhost:5000/api`. |
| `WEDPLAN_API_INTERNAL_URL` | No | Optional server-to-server API URL override. |
| `NEXT_PUBLIC_APP_URL` | Recommended | Canonical client origin used by authentication and checkout flows. |
| `IMGBB_API_KEY` | For uploads | Server-side key for the Next.js image upload route. Keep it private. |
| `GOOGLE_CLIENT_ID` | For Google sign-in | Google OAuth client ID. |
| `GOOGLE_CLIENT_SECRET` | For Google sign-in | Google OAuth client secret. Keep it private. |



`WEDPLAN_API_INTERNAL_URL` can be omitted when the public API URL also works for server-side requests. Google variables can be omitted when Google sign-in is not configured. The API server has its own environment variables for JWT, CORS, Stripe, and server configuration; see its README. Never prefix secret values with `NEXT_PUBLIC_`.

## Run Locally

Run the API server and client in separate terminals. Configure the server's environment first, then start the API:

```bash
cd path/to/wedplan-server
npm install
npm run dev
```

In another terminal, start the client:

```bash
cd path/to/wedplan-client
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)**. Check that the API is reachable at **[http://localhost:5000/api/health](http://localhost:5000/api/health)**.

## Available Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create the optimized production build. |
| `npm run start` | Run the production build locally. |
| `npm run lint` | Run ESLint. |

## Deployment

1. Deploy the API server and configure its MongoDB, Better Auth, JWT, CORS, and Stripe environment variables.
2. Deploy this client and add the client environment variables in the hosting provider's project settings.
3. Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to the canonical deployed client origin.
4. Set `NEXT_PUBLIC_API_URL` to the deployed API URL, including `/api`, and configure the API server to allow the client origin.
5. Configure the Google OAuth callback URL and Stripe webhook URL for the deployed domains when using those features.
6. Redeploy after changing environment variables, then verify authentication, service browsing, dashboards, booking, and checkout flows.

## Security

- Keep `.env`, `.env.local`, database credentials, OAuth secrets, ImgBB keys, and Stripe secrets out of Git.
- Keep private credentials on the server; do not expose them through `NEXT_PUBLIC_*` variables.
- Configure production origins and API CORS explicitly.
- Payment success redirects do not grant Premium access; the server verifies Stripe webhook events.

---

<div align="center">
  <sub>WedPlan — wedding planning, thoughtfully.</sub>
</div>