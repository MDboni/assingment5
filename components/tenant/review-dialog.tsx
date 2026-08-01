"use client";

import { SpinnerIcon, StarIcon } from "@phosphor-icons/react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { reviewSchema } from "@/lib/schemas/review";
import { cn } from "@/lib/utils";
import { createReview } from "@/service/review.action";

const RATING_LABELS = [
  "Poor",
  "Fair",
  "Good",
  "Very good",
  "Excellent",
] as const;

export function ReviewDialog({
  rentalRequestId,
  propertyTitle,
}: {
  rentalRequestId: string;
  propertyTitle: string;
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fill stars up to the hovered star; otherwise show the selected rating.
  const displayed = hovered || rating;

  const reset = () => {
    setRating(0);
    setHovered(0);
    setComment("");
    setError(null);
  };

  const handleSubmit = async () => {
    const parsed = reviewSchema.safeParse({ rating, comment });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your review");
      return;
    }

    setError(null);
    setIsSaving(true);

    const result = await createReview({
      rentalRequestId,
      rating: parsed.data.rating,
      comment: parsed.data.comment || undefined,
    });

    setIsSaving(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("Thanks — your review is live.");

    setOpen(false);
    reset();
    router.refresh();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <StarIcon className="size-3.5" />
        Leave a review
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">How was your stay?</DialogTitle>

          <DialogDescription className="text-[11px]">
            {propertyTitle}
          </DialogDescription>
        </DialogHeader>

        {/* ── Stars ── */}
        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            Rating
          </Label>

          <div
            className="flex items-center gap-1"
            onMouseLeave={() => setHovered(0)}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`${value} star${value > 1 ? "s" : ""}`}
                aria-pressed={rating === value}
                onMouseEnter={() => setHovered(value)}
                onFocus={() => setHovered(value)}
                onBlur={() => setHovered(0)}
                onClick={() => {
                  setRating(value);
                  setError(null);
                }}
                className="p-0.5 transition-transform hover:scale-110"
              >
                <StarIcon
                  weight={value <= displayed ? "fill" : "regular"}
                  className={cn(
                    "size-6 transition-colors",
                    value <= displayed
                      ? "text-primary"
                      : "text-muted-foreground/40"
                  )}
                />
              </button>
            ))}

            {displayed > 0 && (
              <span className="ml-2 text-[11px] text-muted-foreground">
                {RATING_LABELS[displayed - 1]}
              </span>
            )}
          </div>

          {error && <p className="text-[11px] text-destructive">{error}</p>}
        </div>

        {/* ── Comment ── */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="review-comment"
              className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground"
            >
              Comment (optional)
            </Label>

            <span className="text-[9px] text-muted-foreground">
              {comment.length}/1000
            </span>
          </div>

          <Textarea
            id="review-comment"
            rows={4}
            maxLength={1000}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="What should the next tenant know about this place?"
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setOpen(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>

          <Button size="lg" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? (
              <>
                <SpinnerIcon className="size-4 animate-spin" />
                Posting…
              </>
            ) : (
              "Post review"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
