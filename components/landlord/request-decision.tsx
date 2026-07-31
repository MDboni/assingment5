"use client";

import { CheckIcon, SpinnerIcon, XIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/format";
import { decideRentalRequest } from "@/service/landlord.action";

type Decision = "APPROVED" | "REJECTED";

export function RequestDecision({
  requestId,
  tenantName,
  propertyTitle,
  quotedAmount,
}: {
  requestId: string;
  tenantName: string;
  propertyTitle: string;
  quotedAmount: number;
}) {
  const router = useRouter();
  const [decision, setDecision] = useState<Decision | null>(null);
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const isApprove = decision === "APPROVED";

  const close = () => {
    setDecision(null);
    setNote("");
  };

  const handleConfirm = async () => {
    if (!decision) return;

    setIsSaving(true);

    const result = await decideRentalRequest(requestId, {
      status: decision,
      ...(note.trim() ? { landloardNote: note.trim() } : {}),
    });

    setIsSaving(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(
      isApprove
        ? `Approved — ${tenantName} can now pay.`
        : `Request rejected.`
    );

    close();
    router.refresh();
  };

  return (
    <>
      <div className="flex items-center gap-1.5">
        <Button size="sm" onClick={() => setDecision("APPROVED")}>
          <CheckIcon className="size-3.5" />
          Approve
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => setDecision("REJECTED")}
        >
          <XIcon className="size-3.5" />
          Reject
        </Button>
      </div>

      <Dialog
        open={decision !== null}
        onOpenChange={(open) => !open && close()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">
              {isApprove ? "Approve this request?" : "Reject this request?"}
            </DialogTitle>

            <DialogDescription className="text-[11px] leading-relaxed">
              <span className="text-foreground">{tenantName}</span> ·{" "}
              {propertyTitle} · {formatCurrency(quotedAmount)}/month
              <br />
              {isApprove
                ? "The tenant will be able to pay right away, and your property will be marked as rented once payment completes."
                : "The tenant will be notified. This cannot be undone."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5">
            <Label
              htmlFor="landlord-note"
              className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground"
            >
              Note to tenant (optional)
            </Label>

            <Textarea
              id="landlord-note"
              rows={3}
              maxLength={1000}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={
                isApprove
                  ? "Welcome! Please pay within 3 days to confirm."
                  : "Sorry, this unit is already committed to someone else."
              }
            />

            <p className="text-right text-[9px] text-muted-foreground">
              {note.length}/1000
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="lg"
              onClick={close}
              disabled={isSaving}
            >
              Cancel
            </Button>

            <Button
              variant={isApprove ? "default" : "destructive"}
              size="lg"
              onClick={handleConfirm}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <SpinnerIcon className="size-4 animate-spin" />
                  Saving…
                </>
              ) : isApprove ? (
                "Yes, approve"
              ) : (
                "Yes, reject"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
