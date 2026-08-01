"use client";

import { ListIcon, SignInIcon, SignOutIcon, SquaresFourIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { NAV_LINKS } from "@/components/shared/nav-links";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DASHBOARD_PATH, ROLE_BADGE, ROLE_LABEL } from "@/lib/roles";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { logout } from "@/service/logout";

export function MobileNav({ user }: { user: User | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Close the drawer automatically when the route changes.
  useEffect(() => setOpen(false), [pathname]);

  const handleLogout = () => {
    startTransition(async () => {
      await logout();

      toast.success("Signed out successfully");
      setOpen(false);

      router.push("/login");
      router.refresh();
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" aria-label="Open menu" />}
        className="md:hidden"
      >
        <ListIcon className="size-4" />
      </SheetTrigger>

      <SheetContent side="right" className="w-72 p-0">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="text-sm">
            {user ? user.name : "Menu"}
          </SheetTitle>

          <SheetDescription className="text-[11px]">
            {user ? user.email : "Browse rentals on RentNest"}
          </SheetDescription>

          {user && (
            <span
              className={cn(
                "mt-1 inline-block w-fit border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em]",
                ROLE_BADGE[user.role]
              )}
            >
              {ROLE_LABEL[user.role]}
            </span>
          )}
        </SheetHeader>

        <nav className="flex flex-col px-2 py-3">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "border-l-2 px-3 py-2.5 text-xs transition-colors",
                  isActive
                    ? "border-primary bg-primary/5 font-medium text-primary"
                    : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-border p-4">
          {user ? (
            <div className="space-y-2">
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                render={<Link href={DASHBOARD_PATH[user.role]} />}
              >
                <SquaresFourIcon className="size-4" />
                Dashboard
              </Button>

              <Button
                variant="destructive"
                size="lg"
                className="w-full"
                disabled={isPending}
                onClick={handleLogout}
              >
                <SignOutIcon className="size-4" />
                {isPending ? "Signing out…" : "Sign out"}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                render={<Link href="/login" />}
              >
                <SignInIcon className="size-4" />
                Sign in
              </Button>

              <Button size="lg" className="w-full" render={<Link href="/register" />}>
                Get started
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
