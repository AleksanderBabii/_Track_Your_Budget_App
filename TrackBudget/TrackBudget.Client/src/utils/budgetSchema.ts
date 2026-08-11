import { z } from "zod";

const currentYear = new Date().getFullYear();

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const MONTH_OPTIONS = MONTH_NAMES.map((name, index) => ({
  value: String(index + 1),
  label: name,
}));

export const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => currentYear - 1 + i).map((year) => ({
  value: String(year),
  label: String(year),
}));

export const budgetSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  limit: z
    .number({ error: "Limit must be a number" })
    .positive("Limit must be greater than 0"),
  month: z.number().min(1).max(12),
  year: z.number().min(2020).max(2100),
});

export type BudgetFormValues = z.infer<typeof budgetSchema>;
