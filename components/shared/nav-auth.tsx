import Link from "next/link";

import { MobileNav } from "@/components/shared/mobile-nav";
import { UserMenu } from "@/components/shared/user-menu";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/service/getMe";

/**
 * async Server Component — Suspense-এর ভিতরে বসে।
 * getMe resolve না হওয়া পর্যন্ত navbar-এর বাকি অংশ আটকে থাকে না,
 * শুধু এই টুকরোটার জায়গায় skeleton দেখায়।
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
