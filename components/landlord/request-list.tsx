"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";

import { LandlordRequestRow } from "@/components/landlord/landlord-request-row";
import type { RentalRequest, RentalStatus } from "@/lib/types";
import { decideRentalRequest } from "@/service/landlord.action";

type OptimisticUpdate = {
  id: string;
  status: RentalStatus;
  landloardNote?: string;
};

/**
 * Optimistic updates for approve/reject.
 *
 * useOptimistic only persists during the transition, so the server call must
 * also stay inside the same startTransition. Once it finishes, React returns
 * to the real server data automatically, so no manual undo is needed.
 */
export function RequestList({ requests }: { requests: RentalRequest[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [optimisticRequests, applyOptimistic] = useOptimistic(
    requests,
    (current, update: OptimisticUpdate) =>
      current.map((request) =>
        request.id === update.id
          ? {
              ...request,
              status: update.status,
              landloardNote: update.landloardNote ?? request.landloardNote,
            }
          : request
      )
  );

  const decide = (
    requestId: string,
    status: "APPROVED" | "REJECTED",
    landloardNote?: string
  ) => {
    startTransition(async () => {
      // 1. Update the badge immediately — no need to wait for the server.
      applyOptimistic({ id: requestId, status, landloardNote });

      // 2. Then make the real call.
      const result = await decideRentalRequest(requestId, {
        status,
        ...(landloardNote ? { landloardNote } : {}),
      });

      if (!result.success) {
        // The optimistic state will revert on its own; just show the error.
        toast.error(result.message);
        return;
      }

      toast.success(
        status === "APPROVED"
          ? "Request approved — the tenant can now pay."
          : "Request rejected."
      );

      router.refresh();
    });
  };

  return (
    <div className="space-y-3">
      {optimisticRequests.map((request) => (
        <LandlordRequestRow
          key={request.id}
          request={request}
          onDecide={decide}
          isPending={isPending}
        />
      ))}
    </div>
  );
}
