"use client";

import {
  CaretDownIcon,
  GearIcon,
  SignOutIcon,
  SquaresFourIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DASHBOARD_PATH, ROLE_BADGE, ROLE_LABEL } from "@/lib/roles";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { logout } from "@/service/logout";

/** "Rahim Uddin" → "RU" */
const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export function UserMenu({ user }: { user: User }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();

      toast.success("Signed out successfully");

      router.push("/login");
      router.refresh(); // Re-render the Server Components.
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "group inline-flex items-center gap-2 border border-transparent px-1.5 py-1 transition-colors",
          "hover:border-border hover:bg-muted/60 aria-expanded:border-border aria-expanded:bg-muted/60"
        )}
        aria-label="Account menu"
      >
        <span className="grid size-7 shrink-0 place-items-center bg-primary text-[10px] font-semibold text-primary-foreground">
          {getInitials(user.name)}
        </span>

        <span className="hidden text-left sm:block">
          <span className="block max-w-28 truncate text-[11px] leading-tight font-medium">
            {user.name}
          </span>
          <span className="block text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
            {ROLE_LABEL[user.role]}
          </span>
        </span>

        <CaretDownIcon className="size-3 text-muted-foreground transition-transform group-aria-expanded:rotate-180" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-56">
        {/* ── Identity ── */}
        <div className="border-b border-border px-2.5 py-2.5">
          <p className="truncate text-xs font-medium">{user.name}</p>
          <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
            {user.email}
          </p>

          <span
            className={cn(
              "mt-2 inline-block border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em]",
              ROLE_BADGE[user.role]
            )}
          >
            {ROLE_LABEL[user.role]}
          </span>
        </div>

        <DropdownMenuItem render={<Link href={DASHBOARD_PATH[user.role]} />}>
          <SquaresFourIcon className="size-4" />
          Dashboard
        </DropdownMenuItem>

        <DropdownMenuItem render={<Link href="/profile" />}>
          <GearIcon className="size-4" />
          Profile settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          disabled={isPending}
          onClick={handleLogout}
        >
          <SignOutIcon className="size-4" />
          {isPending ? "Signing out…" : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
