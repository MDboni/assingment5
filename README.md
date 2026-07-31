# RentNest — Frontend

A rental property marketplace built with the Next.js App Router. Tenants browse verified
listings and pay online, landlords manage their properties and approve requests, and admins
moderate the whole platform.

> Assignment 5 (frontend). The API it consumes is the RentNest backend from Assignment 4.

---

## Links

| Item | URL |
| --- | --- |
| Live frontend | _add your Vercel URL_ |
| Backend API | _add your API URL_ |
| Frontend repo | _add your repo URL_ |
| Demo video | _add your video URL_ |

### Test accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@rentnest.com` | `admin123` |
| Landlord | `demo.landlord@rentnest.com` | `Admin@12345` |
| Tenant | `demo.tenant@rentnest.com` | `Admin@12345` |

The login page has one-click buttons that fill these in.

---

## Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui on Base UI |
| Forms | React Hook Form + Zod |
| Data | Server Components + `fetch` with tag-based revalidation |
| Auth | Custom JWT in `httpOnly` cookies, verified in `proxy.ts` with `jose` |
| Payments | Stripe Checkout |
| Notifications | Sonner |
| Theming | `next-themes` (light / dark) |

---

## Running locally

**1. Install**

```bash
npm install
```

**2. Create `.env`**

```bash
BACKEND_API_URL=http://localhost:5000
JWT_ACCESS_SECRET=<exactly the same value as the backend's JWT_ACCESS_SECRET>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**3. Point the backend at this app** (in the backend's `.env`)

```bash
APP_URL=http://localhost:3000                              # CORS origin
STRIPE_SUCCESS_URL=http://localhost:3000/payment/success
STRIPE_CANCEL_URL=http://localhost:3000/payment/cancel
```

**4. Start both servers**

```bash
# terminal 1 — backend
npm run dev        # http://localhost:5000

# terminal 2 — frontend
npm run dev        # http://localhost:3000
```

**5. For payments, forward Stripe webhooks**

```bash
stripe listen --forward-to localhost:5000/api/payments/confirm
```

Put the `whsec_…` it prints into the backend's `STRIPE_WEBHOOK_SECRET` and restart it.
Test card: `4242 4242 4242 4242`, any future expiry, any CVC.

---

## Project structure

```
app/
├── (publicGroup)/          navbar + footer
│   ├── page.tsx            home
│   ├── properties/         browse, filters, details
│   ├── payment/            success, cancel
│   └── profile/
├── (authGroup)/            split-screen, no navbar
│   ├── login/  register/
│   ├── _action/auth.ts     login + register Server Actions
│   └── _components/        the two forms
├── (dashboardGroup)/       sidebar shell, role-aware
│   ├── tenant-dashboard/
│   ├── landloard-dashboard/
│   └── admin-dashboard/
├── error.tsx  global-error.tsx  not-found.tsx
components/
├── ui/                     shadcn primitives
├── shared/  dashboard/  property/  landlord/  admin/  profile/  home/  payment/
lib/
├── types/   schemas/   roles.ts  constants.ts  format.ts  dashboard-nav.ts
service/                    all API access (see API_INTEGRATION.md)
utils/
├── api.ts                  authFetch — token + headers + error shape
└── jwt.ts                  Edge-safe JWT verification
proxy.ts                    route protection (Next.js 16's middleware)
```

---

## Features

**Public** — responsive property grid with `next/image`, filtering by keyword, city, category,
price, bedrooms and amenities (all driven by the URL, so filtered views are shareable),
paginated results, image gallery, reviews, skeleton loaders, dark/light mode.

**Tenant** — register and sign in, send rental requests with date validation, status badges
(`PENDING` / `APPROVED` / `PAYMENT_PENDING` / `ACTIVE` / `REJECTED` / `COMPLETED`), Stripe
Checkout, payment history, receipt page that updates itself when the webhook lands.

**Landlord** — dashboard with property counts and monthly income, full property CRUD with
multi-image input and live previews, incoming request list, approve/reject with a note to the
tenant, mark active rentals complete.

**Admin** — platform stats, user management with search, role filter, pagination and ban/unban,
read-only views of every property and rental, category CRUD with hide/show.

---

## Notes on a few decisions

**Token in an `httpOnly` cookie, not `localStorage`.** JavaScript cannot read it, so an XSS bug
cannot steal the session. Every API call goes out from the Next.js server, which attaches the
cookie itself.

**`proxy.ts`, not `middleware.ts`.** Next.js 16 renamed the file. It runs on the Edge runtime,
so `jsonwebtoken` is unavailable and `jose` is used instead. It only verifies the signature —
it never calls the backend, which keeps navigation fast.

**Only public data is cached.** Anything fetched with a token uses `cache: "no-store"`; a shared
cache key on personal data risks serving one user's profile to another.

**Amounts are never sent from the client.** Checkout only posts `rentalRequestId`; the backend
reads the stored `quotedAmount`, so the price cannot be tampered with in the browser.

**Server Actions return `{ success, message }` instead of throwing.** In production Next.js
hides thrown error messages, and the user would never see *why* something failed.

Full endpoint-by-endpoint mapping is in [API_INTEGRATION.md](./API_INTEGRATION.md).

---

## Backend change made for this assignment

`GET /api/landlord/properties` was added. The public `/api/properties` only returns `AVAILABLE`
listings, so landlords could not see their own `RENTED`, `UNAVAILABLE` or `ARCHIVED` properties.
The new endpoint supports `status` and `search` filters plus pagination, and returns
`pendingRequestCount` per property for the "N new" badge.
