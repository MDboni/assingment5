import { redirect } from "next/navigation";

import { DashboardMobileNav } from "@/components/dashboard/dashboard-mobile-nav";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { Brand } from "@/components/shared/brand";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserMenu } from "@/components/shared/user-menu";
import { getCurrentUser } from "@/service/getMe";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();

  // proxy.ts should already block this — this is a second layer of defense.
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-40 border-b border-border glass">
        <div className="flex h-14 items-center justify-between gap-4 px-5 lg:px-6">
          <div className="flex items-center gap-3">
            <DashboardMobileNav role={user.role} />
            <Brand />
          </div>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <span className="mx-1 hidden h-5 w-px bg-border sm:block" />
            <UserMenu user={user} />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* ── Left sidebar (desktop) ── */}
        <aside className="hidden w-56 shrink-0 border-r border-border lg:block">
          <div className="sticky top-14 p-4">
            <DashboardSidebar role={user.role} />
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
