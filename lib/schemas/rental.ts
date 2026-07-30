import { z } from "zod";

const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const rentalRequestSchema = z
  .object({
    moveInDate: z.string().min(1, "Move-in date is required"),
    moveOutDate: z.string().optional().or(z.literal("")),
    message: z
      .string()
      .max(1000, "Message must be under 1000 characters")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => new Date(data.moveInDate) >= startOfToday(), {
    message: "Move-in date cannot be in the past",
    path: ["moveInDate"],
  })
  .refine(
    (data) =>
      !data.moveOutDate ||
      new Date(data.moveOutDate) > new Date(data.moveInDate),
    {
      message: "Move-out date must be after move-in date",
      path: ["moveOutDate"],
    }
  );

export type RentalRequestValues = z.infer<typeof rentalRequestSchema>;
