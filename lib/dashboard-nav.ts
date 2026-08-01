import type { UserRole } from "@/lib/types";

export type DashboardNavItem = {
  href: string;
  label: string;
  /** Phosphor icon name — map it in the component. */
  icon: "overview" | "requests" | "payments" | "properties" | "users" | "tags";
};

export const DASHBOARD_NAV: Record<UserRole, DashboardNavItem[]> = {
  TENANT: [
    { href: "/tenant-dashboard", label: "Overview", icon: "overview" },
    { href: "/tenant-dashboard/requests", label: "My requests", icon: "requests" },
    { href: "/tenant-dashboard/payments", label: "Payments", icon: "payments" },
  ],
  LANDLORD: [
    { href: "/landloard-dashboard", label: "Overview", icon: "overview" },
    { href: "/landloard-dashboard/properties", label: "My properties", icon: "properties" },
    { href: "/landloard-dashboard/requests", label: "Requests", icon: "requests" },
  ],
  ADMIN: [
    { href: "/admin-dashboard", label: "Overview", icon: "overview" },
    { href: "/admin-dashboard/users", label: "Users", icon: "users" },
    { href: "/admin-dashboard/properties", label: "Properties", icon: "properties" },
    { href: "/admin-dashboard/rentals", label: "Rentals", icon: "requests" },
    { href: "/admin-dashboard/categories", label: "Categories", icon: "tags" },
  ],
};
