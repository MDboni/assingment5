import { z } from "zod";

/**
 * I intentionally keep the numeric fields as strings.
 * <input type="number"> always returns a string, and if zod expects a number
 * then an empty field becomes NaN and the error message gets awkward.
 * We'll convert with Number() at submit time.
 */
const numericField = (label: string) =>
  z
    .string()
    .min(1, `${label} is required`)
    .refine((value) => !Number.isNaN(Number(value)), `${label} must be a number`);

export const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),

  description: z
    .string()
    .min(20, "Description must be at least 20 characters"),

  categoryId: z.string().uuid("Please choose a property type"),

  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  area: z.string().min(2, "Area is required"),

  monthlyRent: numericField("Monthly rent").refine(
    (value) => Number(value) > 0,
    "Monthly rent must be greater than 0"
  ),

  securityDeposit: numericField("Security deposit").refine(
    (value) => Number(value) >= 0,
    "Security deposit cannot be negative"
  ),

  bedrooms: numericField("Bedrooms").refine(
    (value) => Number.isInteger(Number(value)) && Number(value) >= 0,
    "Bedrooms must be a whole number"
  ),

  bathrooms: numericField("Bathrooms").refine(
    (value) => Number.isInteger(Number(value)) && Number(value) >= 0,
    "Bathrooms must be a whole number"
  ),

  sizeSqft: numericField("Size").refine(
    (value) => Number.isInteger(Number(value)) && Number(value) > 0,
    "Size must be a whole number greater than 0"
  ),

  amenities: z.array(z.string()),

  // useFieldArray expects objects, so avoid empty strings.
  images: z
    .array(z.object({ url: z.string().url("Enter a valid image URL") }))
    .min(1, "Add at least one image URL"),

  availableFrom: z.string().optional().or(z.literal("")),

  status: z.enum(["AVAILABLE", "UNAVAILABLE", "ARCHIVED"]),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;
