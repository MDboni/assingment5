/** Everything here comes from the backend's real data. */

export const CITIES = ["Dhaka", "Chattogram", "Sylhet"] as const;

export const AMENITIES = [
  "furnished",
  "garden",
  "generator",
  "gym",
  "lift",
  "parking",
  "security",
  "wifi",
] as const;

export const BEDROOM_OPTIONS = ["1", "2", "3", "4"] as const;

export const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "monthlyRent:asc", label: "Price: low to high" },
  { value: "monthlyRent:desc", label: "Price: high to low" },
  { value: "bedrooms:desc", label: "Most bedrooms" },
  { value: "sizeSqft:desc", label: "Largest first" },
] as const;

export const PAGE_SIZE = 9;
