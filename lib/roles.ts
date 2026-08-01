import type { UserRole } from "@/lib/types";

/** Matches the names of your (dashboardGroup) folders. */
export const DASHBOARD_PATH: Record<UserRole, string> = {
  TENANT: "/tenant-dashboard",
  LANDLORD: "/landloard-dashboard",
  ADMIN: "/admin-dashboard",
};

export const ROLE_LABEL: Record<UserRole, string> = {
  TENANT: "Tenant",
  LANDLORD: "Landlord",
  ADMIN: "Admin",
};

/** Different colors per role in the navbar badge and dashboard. */
export const ROLE_BADGE: Record<UserRole, string> = {
  TENANT: "bg-chart-1/15 text-chart-1 border-chart-1/30",
  LANDLORD: "bg-primary/15 text-primary border-primary/30",
  ADMIN: "bg-destructive/10 text-destructive border-destructive/30",
};
