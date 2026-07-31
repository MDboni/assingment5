"use client";

import { ProhibitIcon, SpinnerIcon } from "@phosphor-icons/react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { cancelRentalRequest } from "@/service/rental.action";

export function CancelRequestButton({
  rentalRequestId,
  propertyTitle,
}: {
  rentalRequestId: string;
  propertyTitle: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleConfirm = async () => {
    setIsSaving(true);

    const result = await cancelRentalRequest(rentalRequestId);

    setIsSaving(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("Request cancelled.");

    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="sm" />}>
        <ProhibitIcon className="size-3.5" />
        Cancel
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm">Cancel this request?</DialogTitle>

          <DialogDescription className="text-[11px] leading-relaxed">
            Your request for{" "}
            <span className="text-foreground">{propertyTitle}</span> will be
            withdrawn and the landlord will be notified. You can always send a
            new request later.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setOpen(false)}
            disabled={isSaving}
          >
            Keep request
          </Button>

          <Button
            variant="destructive"
            size="lg"
            onClick={handleConfirm}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <SpinnerIcon className="size-4 animate-spin" />
                Cancelling…
              </>
            ) : (
              "Yes, cancel"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
