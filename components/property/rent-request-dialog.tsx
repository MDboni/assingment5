"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SpinnerIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Field } from "@/components/shared/form-field";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/format";
import {
  rentalRequestSchema,
  type RentalRequestValues,
} from "@/lib/schemas/rental";
import { createRentalRequest } from "@/service/rental.action";

export function RentRequestDialog({
  propertyId,
  propertyTitle,
  monthlyRent,
}: {
  propertyId: string;
  propertyTitle: string;
  monthlyRent: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RentalRequestValues>({
    resolver: zodResolver(rentalRequestSchema),
    defaultValues: { moveInDate: "", moveOutDate: "", message: "" },
  });

  const messageLength = watch("message")?.length ?? 0;

  const onSubmit = async (values: RentalRequestValues) => {
    const result = await createRentalRequest({
      propertyId,
      moveInDate: values.moveInDate,
      moveOutDate: values.moveOutDate || undefined,
      message: values.message || undefined,
    });

    if (!result.success) {
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, message]) => {
          setError(field as keyof RentalRequestValues, {
            type: "server",
            message,
          });
        });
      }

      toast.error(result.message);
      return;
    }

    toast.success("Request sent — the landlord will review it shortly.");

    setOpen(false);
    reset();

    router.push("/tenant-dashboard");
  };

  // The min on <input type="date"> prevents selecting past dates.
  const todayValue = new Date().toISOString().slice(0, 10);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="lg" className="mt-6 w-full" />}>
        Request to rent
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">Request to rent</DialogTitle>

          <DialogDescription className="text-[11px]">
            {propertyTitle} · {formatCurrency(monthlyRent)}/month
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Field
            id="moveInDate"
            type="date"
            label="Move-in date"
            min={todayValue}
            error={errors.moveInDate?.message}
            {...register("moveInDate")}
          />

          <Field
            id="moveOutDate"
            type="date"
            label="Move-out date (optional)"
            min={todayValue}
            error={errors.moveOutDate?.message}
            {...register("moveOutDate")}
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="message"
                className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground"
              >
                Message (optional)
              </Label>

              <span className="text-[9px] text-muted-foreground">
                {messageLength}/1000
              </span>
            </div>

            <Textarea
              id="message"
              rows={4}
              placeholder="Tell the landlord a bit about yourself…"
              aria-invalid={!!errors.message}
              {...register("message")}
            />

            {errors.message && (
              <p className="text-[11px] text-destructive">
                {errors.message.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <SpinnerIcon className="size-4 animate-spin" />
                  Sending…
                </>
              ) : (
                "Send request"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
