import { z } from "zod";

export const reviewSchema = z.object({
  rating: z
    .number({ required_error: "Please pick a rating" })
    .int()
    .min(1, "Please pick a rating")
    .max(5, "Rating must be between 1 and 5"),

  comment: z
    .string()
    .max(1000, "Comment must be under 1000 characters")
    .optional()
    .or(z.literal("")),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
