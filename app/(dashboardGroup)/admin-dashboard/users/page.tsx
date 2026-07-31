import { UsersThreeIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";

import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/dashboard/error-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { SearchBox } from "@/components/dashboard/search-box";
import { StatusFilter } from "@/components/dashboard/status-filter";
import { UserStatusButton } from "@/components/admin/user-status-button";
import { PaginationNav } from "@/components/shared/pagination-nav";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import { ROLE_BADGE, ROLE_LABEL } from "@/lib/roles";
import { cn } from "@/lib/utils";
import { getAllUsers } from "@/service/admin";
import { getCurrentUser } from "@/service/getMe";

export const metadata: Metadata = { title: "Users" };

const PAGE_SIZE = 12;

const ROLE_OPTIONS = [
  { value: "TENANT", label: "Tenants" },
  { value: "LANDLORD", label: "Landlords" },
  { value: "ADMIN", label: "Admins" },
];

type SearchParams = Record<string, string | string[] | undefined>;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const pick = (key: string) =>
    typeof params[key] === "string" && params[key] ? params[key] : undefined;

  const [me, result] = await Promise.all([
    getCurrentUser(),
    getAllUsers({
      search: pick("search"),
      role: pick("role"),
      status: pick("status"),
      page: pick("page"),
      limit: String(PAGE_SIZE),
    }),
  ]);

  const { data: users, meta, error } = result;

  const page = Number(pick("page") ?? 1);
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 1;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="User management"
        description="Search, filter and moderate every account on the platform."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBox placeholder="Search name, email or phone…" />

        <StatusFilter
          basePath="/admin-dashboard/users"
          current={pick("role")}
          options={ROLE_OPTIONS}
        />
      </div>

      {error ? (
        <ErrorState message={error} />
      ) : users.length === 0 ? (
        <EmptyState
          icon={UsersThreeIcon}
          title="No users found"
          description="Try a different search term or clear the role filter."
        />
      ) : (
        <>
          <p className="text-[11px] text-muted-foreground">
            Showing <span className="text-foreground">{users.length}</span> of{" "}
            <span className="text-foreground">{meta?.total ?? 0}</span> users
          </p>

          <div className="overflow-x-auto border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[10px] uppercase tracking-[0.12em]">
                    User
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-[0.12em]">
                    Role
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-[0.12em]">
                    Activity
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-[0.12em]">
                    Joined
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-[0.12em]">
                    Status
                  </TableHead>
                  <TableHead className="text-right text-[10px] uppercase tracking-[0.12em]">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.map((user) => {
                  const isSelf = user.id === me?.id;
                  const canModerate = user.role !== "ADMIN" && !isSelf;

                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <p className="text-xs font-medium">
                          {user.name}
                          {isSelf && (
                            <span className="ml-1.5 text-[9px] text-muted-foreground">
                              (you)
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {user.email}
                        </p>
                      </TableCell>

                      <TableCell>
                        <span
                          className={cn(
                            "inline-block border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em]",
                            ROLE_BADGE[user.role]
                          )}
                        >
                          {ROLE_LABEL[user.role]}
                        </span>
                      </TableCell>

                      <TableCell className="text-[10px] text-muted-foreground">
                        {user.role === "LANDLORD"
                          ? `${user._count.properties} properties`
                          : `${user._count.tenantRentals} rentals`}
                      </TableCell>

                      <TableCell className="text-[10px] text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </TableCell>

                      <TableCell>
                        <span
                          className={cn(
                            "inline-block border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em]",
                            user.status === "ACTIVE"
                              ? "border-primary/30 bg-primary/10 text-primary"
                              : "border-destructive/30 bg-destructive/10 text-destructive"
                          )}
                        >
                          {user.status}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        {canModerate ? (
                          <UserStatusButton
                            userId={user.id}
                            userName={user.name}
                            status={user.status}
                          />
                        ) : (
                          <span className="text-[10px] text-muted-foreground">
                            —
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <PaginationNav
            basePath="/admin-dashboard/users"
            page={page}
            totalPages={totalPages}
            searchParams={params}
          />
        </>
      )}
    </div>
  );
}
