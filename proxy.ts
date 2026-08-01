import { NextResponse, type NextRequest } from "next/server";

import { DASHBOARD_PATH } from "@/lib/roles";
import type { UserRole } from "@/lib/types";
import { verifyToken } from "@/utils/jwt";

/** Send logged-in users here to their dashboard. */
const AUTH_ROUTES = ["/login", "/register"];

/** Block access unless the user has the required role. */
const ROLE_ROUTES: { prefix: string; role: UserRole }[] = [
  { prefix: "/tenant-dashboard", role: "TENANT" },
  { prefix: "/landloard-dashboard", role: "LANDLORD" },
  { prefix: "/admin-dashboard", role: "ADMIN" },
];

/** Login is required here, regardless of role. */
const PRIVATE_ROUTES = [
  "/profile",
  ...ROLE_ROUTES.map((route) => route.prefix),
];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const token = request.cookies.get("accessToken")?.value;
  const user = await verifyToken(token); // Returns null if the token is invalid or expired.

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isPrivateRoute = PRIVATE_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // ── 1. Logged in users who hit login/register go to their own dashboard ──
  if (user && isAuthRoute) {
    return NextResponse.redirect(
      new URL(DASHBOARD_PATH[user.role], request.url)
    );
  }

  // ── 2. Logged out users who hit protected routes go to login ──
  if (!user && isPrivateRoute) {
    const loginUrl = new URL("/login", request.url);

    // Return here after login.
    loginUrl.searchParams.set("redirect", pathname + search);

    const response = NextResponse.redirect(loginUrl);

    // A token was present but verification failed = expired, so clear the stale cookie.
    if (token) {
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
    }

    return response;
  }

  // ── 3. Logged in users trying to access another role's dashboard ──
  if (user) {
    const matched = ROLE_ROUTES.find((route) =>
      pathname.startsWith(route.prefix)
    );

    if (matched && matched.role !== user.role) {
      return NextResponse.redirect(
        new URL(DASHBOARD_PATH[user.role], request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
    * Runs on all paths except:
    * api, _next/static, _next/image, favicon, and any image file.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
