import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { PasswordForm } from "@/components/profile/password-form";
import { ProfileForm } from "@/components/profile/profile-form";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { DASHBOARD_PATH, ROLE_BADGE, ROLE_LABEL } from "@/lib/roles";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/service/getMe";

export const metadata: Metadata = { title: "Profile settings" };

export default async function ProfilePage() {
  const user = await getCurrentUser();

  // proxy.ts আগেই আটকায় — এটা দ্বিতীয় স্তর
  if (!user) redirect("/login?redirect=/profile");

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-12 lg:px-8">
      {/* ── শিরোনাম ── */}
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid size-12 shrink-0 place-items-center bg-primary text-sm font-semibold text-primary-foreground">
            {user.name
              .trim()
              .split(/\s+/)
              .slice(0, 2)
              .map((part) => part[0])
              .join("")
              .toUpperCase()}
          </span>

          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight">
              {user.name}
            </h1>

            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em]",
                  ROLE_BADGE[user.role]
                )}
              >
                {ROLE_LABEL[user.role]}
              </span>

              <span className="text-[10px] text-muted-foreground">
                Joined {formatDate(user.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="lg"
          render={<Link href={DASHBOARD_PATH[user.role]} />}
        >
          Go to dashboard
        </Button>
      </div>

      {/* ── ব্যক্তিগত তথ্য ── */}
      <section className="mt-8 border border-border bg-card p-6">
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-primary">
          Personal details
        </h2>

        <p className="mt-1.5 mb-6 text-[11px] text-muted-foreground">
          This is what landlords and tenants see about you.
        </p>

        <ProfileForm user={user} />
      </section>

      {/* ── পাসওয়ার্ড ── */}
      <section className="mt-6 border border-border bg-card p-6">
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-primary">
          Password
        </h2>

        <p className="mt-1.5 mb-6 text-[11px] text-muted-foreground">
          Choose a strong password you don&apos;t use anywhere else.
        </p>

        <PasswordForm />
      </section>
    </div>
  );
}
