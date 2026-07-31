"use client";

import { FlagCheckeredIcon, SpinnerIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { completeRentalRequest } from "@/service/landlord.action";

export function CompleteRentalButton({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleClick = async () => {
    setIsSaving(true);

    const result = await completeRentalRequest(requestId);

    setIsSaving(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("Rental completed — the property is available again.");
    router.refresh();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isSaving}
      onClick={handleClick}
    >
      {isSaving ? (
        <SpinnerIcon className="size-3.5 animate-spin" />
      ) : (
        <FlagCheckeredIcon className="size-3.5" />
      )}
      Mark completed
    </Button>
  );
}
