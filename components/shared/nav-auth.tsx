import Link from "next/link";

import { MobileNav } from "@/components/shared/mobile-nav";
import { UserMenu } from "@/components/shared/user-menu";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/service/getMe";

/**
 * Async Server Component — used inside Suspense.
 * Until getMe resolves, the rest of the navbar does not block;
 * only this section shows a skeleton.
 */
export async function NavAuth() {
  const user = await getCurrentUser();

  return (
    <>
      {user ? (
        <div className="hidden md:block">
          <UserMenu user={user} />
        </div>
      ) : (
        <div className="hidden items-center gap-1.5 md:flex">
          <Button variant="ghost" size="default" render={<Link href="/login" />}>
            Sign in
          </Button>

          <Button size="default" render={<Link href="/register" />}>
            Get started
          </Button>
        </div>
      )}

      <MobileNav user={user} />
    </>
  );
}
