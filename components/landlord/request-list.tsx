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
 * Approve/Reject-এ optimistic update।
 *
 * useOptimistic শুধু transition চলাকালীন টিকে থাকে — তাই server call টাও
 * একই startTransition-এর ভিতরে রাখতে হয়। কাজ শেষ হলে React নিজে থেকেই
 * আসল (server থেকে আসা) ডেটায় ফিরে যায়, তাই ম্যানুয়ালি undo করতে হয় না।
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
      // ১. সাথে সাথে badge বদলে দাও — server-এর অপেক্ষা নয়
      applyOptimistic({ id: requestId, status, landloardNote });

      // ২. তারপর সত্যিকারের call
      const result = await decideRentalRequest(requestId, {
        status,
        ...(landloardNote ? { landloardNote } : {}),
      });

      if (!result.success) {
        // optimistic state নিজে থেকেই ফিরে যাবে, শুধু জানিয়ে দিই
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
