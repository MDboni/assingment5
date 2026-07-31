"use client";

import { ProhibitIcon, SpinnerIcon, CheckCircleIcon } from "@phosphor-icons/react";
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
import type { UserStatus } from "@/lib/types";
import { updateUserStatus } from "@/service/admin.action";

export function UserStatusButton({
  userId,
  userName,
  status,
}: {
  userId: string;
  userName: string;
  status: UserStatus;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isBanned = status === "BANNED";
  const nextStatus: UserStatus = isBanned ? "ACTIVE" : "BANNED";

  const handleConfirm = async () => {
    setIsSaving(true);

    const result = await updateUserStatus(userId, nextStatus);

    setIsSaving(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(
      isBanned ? `${userName} can sign in again.` : `${userName} has been banned.`
    );

    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant={isBanned ? "outline" : "destructive"} size="sm" />
        }
      >
        {isBanned ? (
          <>
            <CheckCircleIcon className="size-3.5" />
            Unban
          </>
        ) : (
          <>
            <ProhibitIcon className="size-3.5" />
            Ban
          </>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm">
            {isBanned ? "Unban this user?" : "Ban this user?"}
          </DialogTitle>

          <DialogDescription className="text-[11px] leading-relaxed">
            <span className="text-foreground">{userName}</span>{" "}
            {isBanned
              ? "will be able to sign in and use RentNest again."
              : "will be blocked from signing in. Their existing data stays intact."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setOpen(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>

          <Button
            variant={isBanned ? "default" : "destructive"}
            size="lg"
            onClick={handleConfirm}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <SpinnerIcon className="size-4 animate-spin" />
                Saving…
              </>
            ) : isBanned ? (
              "Yes, unban"
            ) : (
              "Yes, ban"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
