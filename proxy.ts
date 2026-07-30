import { NextResponse, type NextRequest } from "next/server";

import { DASHBOARD_PATH } from "@/lib/roles";
import type { UserRole } from "@/lib/types";
import { verifyToken } from "@/utils/jwt";

/** logged-in user এখানে ঢুকলে dashboard-এ পাঠিয়ে দেব */
const AUTH_ROUTES = ["/login", "/register"];

/** নির্দিষ্ট role ছাড়া ঢোকা যাবে না */
const ROLE_ROUTES: { prefix: string; role: UserRole }[] = [
  { prefix: "/tenant-dashboard", role: "TENANT" },
  { prefix: "/landloard-dashboard", role: "LANDLORD" },
  { prefix: "/admin-dashboard", role: "ADMIN" },
];

/** login লাগবেই, role যাই হোক */
const PRIVATE_ROUTES = [
  "/profile",
  ...ROLE_ROUTES.map((route) => route.prefix),
];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const token = request.cookies.get("accessToken")?.value;
  const user = await verifyToken(token); // invalid/expired হলে null

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isPrivateRoute = PRIVATE_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // ── ১. logged in হয়ে login/register-এ এলে → নিজের dashboard ──
  if (user && isAuthRoute) {
    return NextResponse.redirect(
      new URL(DASHBOARD_PATH[user.role], request.url)
    );
  }

  // ── ২. logged out হয়ে protected route-এ এলে → login ──
  if (!user && isPrivateRoute) {
    const loginUrl = new URL("/login", request.url);

    // login-এর পর যেন এখানেই ফেরত আসে
    loginUrl.searchParams.set("redirect", pathname + search);

    const response = NextResponse.redirect(loginUrl);

    // token ছিল কিন্তু verify fail করেছে = মেয়াদ শেষ → বাসি cookie মুছে দাও
    if (token) {
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
    }

    return response;
  }

  // ── ৩. logged in, কিন্তু অন্যের dashboard-এ ঢোকার চেষ্টা ──
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
     * এগুলো ছাড়া সব path-এ চলবে:
     * api, _next/static, _next/image, favicon, আর যেকোনো image file
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
