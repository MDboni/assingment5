"use client";

import { SpinnerIcon, TrashIcon } from "@phosphor-icons/react";
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
import { deleteProperty } from "@/service/landlord.action";

export function DeletePropertyButton({
  propertyId,
  propertyTitle,
}: {
  propertyId: string;
  propertyTitle: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    const result = await deleteProperty(propertyId);

    setIsDeleting(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    // backend চলমান rental থাকলে archive করে — তার নিজের message-ই দেখাচ্ছি
    toast.success(result.message);

    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete ${propertyTitle}`}
          />
        }
      >
        <TrashIcon className="size-3.5 text-destructive" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm">Delete this property?</DialogTitle>

          <DialogDescription className="text-[11px] leading-relaxed">
            <span className="text-foreground">{propertyTitle}</span> will be
            removed from RentNest. If it has rental history it will be archived
            instead, so past records stay intact.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            size="lg"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <SpinnerIcon className="size-4 animate-spin" />
                Deleting…
              </>
            ) : (
              "Delete property"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
