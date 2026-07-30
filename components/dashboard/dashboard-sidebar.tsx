"use client";

import {
  CreditCardIcon,
  HouseLineIcon,
  SquaresFourIcon,
  TagIcon,
  TrayIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { DASHBOARD_NAV, type DashboardNavItem } from "@/lib/dashboard-nav";
import { ROLE_LABEL } from "@/lib/roles";
import type { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICONS = {
  overview: SquaresFourIcon,
  requests: TrayIcon,
  payments: CreditCardIcon,
  properties: HouseLineIcon,
  users: UsersThreeIcon,
  tags: TagIcon,
} as const;

export function DashboardSidebar({
  role,
  onNavigate,
}: {
  role: UserRole;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const items = DASHBOARD_NAV[role];

  return (
    <nav className="space-y-1">
      <p className="mb-4 px-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {ROLE_LABEL[role]} panel
      </p>

      {items.map((item) => (
        <SidebarLink
          key={item.href}
          item={item}
          // Overview ("/tenant-dashboard") সব সাব-রুটেই active হয়ে যেত,
          // তাই ওটার জন্য হুবহু মিল দরকার
          active={
            item.href.split("/").length === 2
              ? pathname === item.href
              : pathname.startsWith(item.href)
          }
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}

function SidebarLink({
  item,
  active,
  onNavigate,
}: {
  item: DashboardNavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = ICONS[item.icon];

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 border-l-2 px-3 py-2 text-[11px] transition-colors",
        active
          ? "border-primary bg-primary/5 font-medium text-primary"
          : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon
        weight={active ? "fill" : "regular"}
        className="size-3.5 shrink-0"
      />
      {item.label}
    </Link>
  );
}
