import { z } from "zod";

export const categoryTypeValues = ["Income", "Expense"] as const;

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .min(2, "Category name must contain at least 2 characters")
    .max(50, "Category name must be at most 50 characters long"),
  type: z.enum(categoryTypeValues, {
    error: () => ({ message: "Category type is required" }),
  }),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
