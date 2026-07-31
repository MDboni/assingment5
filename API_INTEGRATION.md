# API Integration — RentNest Frontend

How this Next.js frontend consumes the RentNest REST API.

- **Backend base URL** — `process.env.BACKEND_API_URL` (default `http://localhost:5000`)
- **Route prefix** — every endpoint is mounted under `/api`
- **Auth transport** — the access token is stored in an `httpOnly` cookie and forwarded
  server-side as a `Cookie: accessToken=<jwt>` header. The token never reaches the browser's
  JavaScript, so it cannot be stolen via XSS.

---

## 1. Architecture

All network calls live in `service/`. Components never call `fetch` directly.

| File pattern | Contains | `"use server"` | Why |
| --- | --- | --- | --- |
| `service/<name>.ts` | Reads / queries | ❌ | Called during Server Component render. A `"use server"` file would expose every export as a public RPC endpoint for no reason. |
| `service/<name>.action.ts` | Writes / mutations | ✅ | Genuinely invoked from the client, so they must be Server Actions. |

Two shared helpers keep the calls consistent:

| Helper | File | Responsibility |
| --- | --- | --- |
| `authFetch<T>()` | `utils/api.ts` | Reads the cookie, attaches the token, returns `ApiResult<T>` or `null` on network failure. |
| `verifyToken()` | `utils/jwt.ts` | Edge-safe JWT verification (`jose`) used by `proxy.ts` for route protection. |

### Response envelope

The backend always answers in one of two shapes, mirrored in `lib/types/index.ts`:

```ts
type ApiSuccess<T> = { success: true;  statusCode: number; message: string; data: T; meta?: ApiMeta };
type ApiError      = { success: false; statusCode: number; message: string; errorDetails?: { path: string; message: string }[] };
type ApiResult<T>  = ApiSuccess<T> | ApiError;
```

Because `success` is a literal `true`/`false`, TypeScript narrows the union after one
`if (!result.success)` check — no casting anywhere.

---

## 2. Endpoint map

### Auth — `/api/auth`

| Method | Endpoint | Called from | UI |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | `app/(authGroup)/_action/auth.ts` → `registerUser` | `register-form.tsx` on `/register` |
| POST | `/api/auth/login` | `app/(authGroup)/_action/auth.ts` → `loginUser` | `login-form.tsx` on `/login` |

`loginUser` takes `accessToken` / `refreshToken` from the response and writes them as
`httpOnly` cookies via `cookies().set()`. It does **not** rely on the backend's `Set-Cookie`
header, because the request originates from the Next.js server, not the browser.

Logout is local-only (`service/logout.ts` deletes both cookies) — no backend round-trip needed.

### Users — `/api/users`

| Method | Endpoint | Called from | UI |
| --- | --- | --- | --- |
| GET | `/api/users/me` | `service/getMe.ts` → `getCurrentUser` | `nav-auth.tsx`, dashboard layout, `rent-cta.tsx`, `/profile` |
| PATCH | `/api/users/me` | `service/user.action.ts` → `updateMyProfile` | `profile-form.tsx` |
| PATCH | `/api/users/me/password` | `service/user.action.ts` → `changeMyPassword` | `password-form.tsx` |

### Properties (public) — `/api/properties`, `/api/categories`

| Method | Endpoint | Called from | UI |
| --- | --- | --- | --- |
| GET | `/api/properties` | `service/property.ts` → `getProperties` | `featured-properties.tsx` on `/`, `property-results.tsx` on `/properties` |
| GET | `/api/properties/:id` | `service/property.ts` → `getPropertyById` | `/properties/[id]` + its `generateMetadata` |
| GET | `/api/categories` | `service/category.ts` → `getCategories` | `category-strip.tsx`, `property-filters.tsx`, `property-form.tsx` |

Supported query params, passed straight through from the URL by `/properties`:
`search`, `city`, `area`, `categorySlug`, `bedrooms`, `bathrooms`, `minPrice`, `maxPrice`,
`amenity`, `page`, `limit`, `sortBy`, `sortOrder`.

### Rentals (tenant) — `/api/rentals`

| Method | Endpoint | Called from | UI |
| --- | --- | --- | --- |
| POST | `/api/rentals` | `service/rental.action.ts` → `createRentalRequest` | `rent-request-dialog.tsx` on `/properties/[id]` |
| GET | `/api/rentals` | `service/rental.ts` → `getMyRentals` | `/tenant-dashboard`, `/tenant-dashboard/requests` |
| PATCH | `/api/rentals/:id/cancel` | `service/rental.action.ts` → `cancelRentalRequest` | `cancel-request-button.tsx` |

`<input type="date">` produces `"2026-08-15"`, but the backend validates with
`z.iso.datetime()`. The action converts with `new Date(value).toISOString()` before sending.

The cancel button only renders for `PENDING` and `APPROVED` requests, matching the backend's
own rule — a button that always errors is worse than no button.

### Reviews — `/api/reviews`

| Method | Endpoint | Called from | UI |
| --- | --- | --- | --- |
| POST | `/api/reviews` | `service/review.action.ts` → `createReview` | `review-dialog.tsx` on `/tenant-dashboard/requests` |

The backend accepts a review only for the tenant's own `COMPLETED` rental, and only once per
rental. The "Leave a review" button therefore renders on `COMPLETED` cards; `ACTIVE` cards show
"Review unlocks when the rental ends" instead. A duplicate attempt still surfaces the backend's
`409` message as a toast. Posted reviews appear on `/properties/[id]` because the action calls
`revalidateTag("properties")`.

### Payments — `/api/payments`

| Method | Endpoint | Called from | UI |
| --- | --- | --- | --- |
| POST | `/api/payments/create` | `service/payment.action.ts` → `startCheckout` | `pay-now-button.tsx` |
| GET | `/api/payments` | `service/payment.ts` → `getMyPayments` | `/tenant-dashboard/payments`, `/payment/success` |

Only `rentalRequestId` is sent — never an amount. The backend derives the charge from the
stored `quotedAmount`, so a tampered client cannot lower the price.

`POST /api/payments/confirm` is the Stripe webhook and is called by Stripe, not by this app.

### Landlord — `/api/landlord`

| Method | Endpoint | Called from | UI |
| --- | --- | --- | --- |
| GET | `/api/landlord/properties` | `service/landlord.ts` → `getMyProperties` | `/landloard-dashboard`, `/landloard-dashboard/properties`, edit page |
| POST | `/api/landlord/properties` | `service/landlord.action.ts` → `createProperty` | `property-form.tsx` on `/properties/new` |
| PUT | `/api/landlord/properties/:id` | `service/landlord.action.ts` → `updateProperty` | `property-form.tsx` on `/properties/[id]/edit` |
| DELETE | `/api/landlord/properties/:id` | `service/landlord.action.ts` → `deleteProperty` | `delete-property-button.tsx` |
| GET | `/api/landlord/requests` | `service/landlord.ts` → `getLandlordRequests` | `/landloard-dashboard/requests` |
| PATCH | `/api/landlord/requests/:id` | `service/landlord.action.ts` → `decideRentalRequest` | `request-decision.tsx` (approve / reject) |
| PATCH | `/api/landlord/requests/:id/complete` | `service/landlord.action.ts` → `completeRentalRequest` | `complete-rental-button.tsx` |

> `GET /api/landlord/properties` was **added to the backend for this assignment**. The public
> `/api/properties` only returns `AVAILABLE` listings, so a landlord could never see their own
> `RENTED`, `UNAVAILABLE` or `ARCHIVED` properties. The new endpoint also returns
> `pendingRequestCount` per property, which drives the "N new" badge in `property-row.tsx`.

### Admin — `/api/admin`

| Method | Endpoint | Called from | UI |
| --- | --- | --- | --- |
| GET | `/api/admin/users` | `service/admin.ts` → `getAllUsers` | `/admin-dashboard`, `/admin-dashboard/users` |
| PATCH | `/api/admin/users/:id` | `service/admin.action.ts` → `updateUserStatus` | `user-status-button.tsx` (ban / unban) |
| GET | `/api/admin/properties` | `service/admin.ts` → `getAllProperties` | `/admin-dashboard/properties` |
| GET | `/api/admin/rentals` | `service/admin.ts` → `getAllRentals` | `/admin-dashboard`, `/admin-dashboard/rentals` |
| GET | `/api/admin/categories` | `service/admin.ts` → `getAdminCategories` | `/admin-dashboard/categories` |
| POST | `/api/admin/categories` | `service/admin.action.ts` → `createCategory` | `category-dialog.tsx` |
| PATCH | `/api/admin/categories/:id` | `service/admin.action.ts` → `updateCategory` | `category-dialog.tsx`, `category-row.tsx` (hide / show) |
| DELETE | `/api/admin/categories/:id` | `service/admin.action.ts` → `deleteCategory` | `category-row.tsx` |

---

## 3. Route → data mapping

| Route | Data source | Rendering |
| --- | --- | --- |
| `/` | `getProperties`, `getCategories` | Static shell + `<Suspense>` streaming |
| `/properties` | `getProperties`, `getCategories` | Server Component, filters read from `searchParams` |
| `/properties/[id]` | `getPropertyById`, `getCurrentUser` | Server Component + `generateMetadata` |
| `/login`, `/register` | — | Client forms → Server Actions |
| `/profile` | `getCurrentUser` | Server Component + two client forms |
| `/tenant-dashboard` | `getMyRentals`, `getMyPayments` | `Promise.all` |
| `/tenant-dashboard/requests` | `getMyRentals` | Status filter via `searchParams` |
| `/tenant-dashboard/payments` | `getMyPayments` | Table |
| `/payment/success` | `getMyPayments` | Auto-refreshes until the webhook lands |
| `/payment/cancel` | — | Static |
| `/landloard-dashboard` | `getMyProperties`, `getLandlordRequests` | `Promise.all` |
| `/landloard-dashboard/properties` | `getMyProperties` | Status filter |
| `/landloard-dashboard/properties/new` | `getCategories` | Create form |
| `/landloard-dashboard/properties/[id]/edit` | `getCategories`, `getMyProperties` | Edit form |
| `/landloard-dashboard/requests` | `getLandlordRequests` | Approve / reject / complete |
| `/admin-dashboard` | `getAllUsers`, `getAllRentals` | `Promise.all` |
| `/admin-dashboard/users` | `getAllUsers`, `getCurrentUser` | Search + filter + pagination |
| `/admin-dashboard/properties` | `getAllProperties` | Search + filter + pagination |
| `/admin-dashboard/rentals` | `getAllRentals` | Filter + pagination |
| `/admin-dashboard/categories` | `getAdminCategories` | Full CRUD |

---

## 4. Caching strategy

Caching is decided per endpoint by whether the response is public or personal.

| Data | Strategy | Tags | Reasoning |
| --- | --- | --- | --- |
| `/api/properties` | `revalidate: 60` | `properties`, `property-<id>` | Public and identical for everyone. |
| `/api/categories` | `revalidate: 3600` | `categories` | Changes very rarely. |
| Everything behind `authFetch` | `cache: "no-store"` | — | Personal data. A shared cache key could leak one user's data to another. |
| `/api/users/me` | `cache: "no-store"` | — | Same reason. `cookies()` already forces dynamic rendering, so caching would only save one hop. |

Mutations invalidate with `revalidateTag(tag, "max")` (Next.js 16 requires the second
`cacheLife` argument):

| Action | Invalidates |
| --- | --- |
| `createProperty` / `deleteProperty` | `properties`, `my-properties` |
| `updateProperty` | `properties`, `my-properties`, `property-<id>` |
| `createRentalRequest` / `cancelRentalRequest` | `my-rentals`, `landlord-requests` |
| `decideRentalRequest` / `completeRentalRequest` | `landlord-requests`, `my-rentals` |
| `createReview` | `properties`, `my-rentals` |
| Category create / update / delete | `categories`, `properties` |
| `updateMyProfile` | `my-profile` |

---

## 5. Error handling

Errors surface in the UI at four levels.

**1. Network failure.** `authFetch` returns `null` when `fetch` throws, and every caller turns
that into `"Cannot reach the server."` — so a stopped backend produces a readable message
instead of a crash.

**2. API errors → toasts.** Server Actions return `{ success, message }` rather than throwing.
Throwing would let Next.js replace the real message with a generic one in production, and the
user would never learn *why* the request failed. The backend's own message is shown verbatim,
e.g. `"You already have an ongoing request for this property"`.

**3. Field errors → inline.** When the backend returns `errorDetails: [{ path, message }]`,
`toFieldErrors()` maps `"body.email"` → `email` and React Hook Form's `setError` places the
message under the matching input. Client-side Zod schemas mirror the backend rules, so most
mistakes are caught before a request is even sent.

**4. Render errors → boundaries.**

| File | Covers |
| --- | --- |
| `app/error.tsx` | Any thrown render error; shows `error.digest` for log lookup |
| `app/global-error.tsx` | Root layout failure; inline styles only, since the stylesheet may not have loaded |
| `app/not-found.tsx` | Unknown routes |
| `app/(publicGroup)/properties/[id]/not-found.tsx` | Missing or archived property |

List pages additionally distinguish three states — **error**, **empty**, and **has data** —
so a stopped backend and a filter with no matches never look the same.

Every route also has a `loading.tsx` whose skeleton mirrors the real layout's dimensions, so
nothing shifts when data arrives.

---

## 5b. Optimistic updates

`/landloard-dashboard/requests` uses React 19's `useOptimistic`. `RequestList` holds the
optimistic state and passes a `decide()` callback down to each row:

```
click Approve → applyOptimistic() flips the badge instantly
              → decideRentalRequest() runs in the same startTransition
              → success: router.refresh() replaces optimistic with real data
              → failure: React reverts automatically, a toast explains why
```

`useOptimistic` only holds while a transition is in flight, which is why the server call lives
inside the same `startTransition` — and why no manual rollback code is needed.

---

## 6. Authentication & route protection

```
login → Server Action → backend /api/auth/login
      → accessToken + refreshToken stored as httpOnly cookies
      → proxy.ts verifies the JWT signature on every request (Edge, via jose)
      → authFetch forwards the cookie on each API call
```

`proxy.ts` (Next.js 16's renamed middleware) enforces:

| Rule | Behaviour |
| --- | --- |
| Signed-in user visits `/login` or `/register` | Redirect to their role's dashboard |
| Signed-out user visits a private route | Redirect to `/login?redirect=<path>`, and stale cookies are cleared |
| Wrong role visits another role's dashboard | Redirect to their own dashboard |

JWT payload: `{ id, email, role }` where `role` is `TENANT | LANDLORD | ADMIN`.

Proxy is an **optimistic check only** — it verifies the signature but never calls the backend,
which keeps every request fast. Real authorisation happens in the backend's `auth()` middleware,
which also rejects banned users. The dashboard layout re-checks `getCurrentUser()` as a second
layer, so a deleted or banned account cannot linger on a protected page.

---

## 7. Payment flow

```
tenant clicks "Pay now"
  → POST /api/payments/create { rentalRequestId }
  → backend creates a Stripe Checkout session, marks the rental PAYMENT_PENDING
  → returns { checkoutUrl }
  → window.location.href = checkoutUrl        (full navigation — a different origin,
                                               so router.push would not work)
  → Stripe redirects back to /payment/success or /payment/cancel
  → Stripe's webhook hits POST /api/payments/confirm
  → payment COMPLETED, rental ACTIVE, property RENTED
```

`/payment/success` reads the latest payment. While it is still `PENDING`, a small client
component calls `router.refresh()` every 3s (capped at 6 attempts) so the receipt updates
itself once the webhook lands — without the user pressing reload, and without polling forever
if the webhook never arrives.

Local testing requires the Stripe CLI, since Stripe cannot reach `localhost`:

```bash
stripe listen --forward-to localhost:5000/api/payments/confirm
```

Test card `4242 4242 4242 4242`, any future expiry, any CVC.

---

## 8. Environment variables

```bash
BACKEND_API_URL=http://localhost:5000       # server-only, never sent to the browser
JWT_ACCESS_SECRET=<same value as the backend>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`BACKEND_API_URL` deliberately has no `NEXT_PUBLIC_` prefix — all API calls happen on the
Next.js server, so the browser never needs it and the backend URL stays private.

The backend must allow this origin in CORS (`APP_URL`) and point its Stripe redirect URLs at
this frontend:

```bash
APP_URL=http://localhost:3000
STRIPE_SUCCESS_URL=http://localhost:3000/payment/success
STRIPE_CANCEL_URL=http://localhost:3000/payment/cancel
```
