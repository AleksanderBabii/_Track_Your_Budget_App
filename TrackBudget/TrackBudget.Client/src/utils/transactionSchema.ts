import { z } from "zod";

export const transactionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must contain at least 2 characters.")
    .max(100, "Title cannot exceed 100 characters."),

  amount: z
    .number({
      error: "Amount is required.",
    })
    .positive("Amount must be greater than zero."),

  accountId: z.string().uuid("Please select an account."),

  categoryId: z.string().uuid("Please select a category."),

  date: z.date(),

  notes: z.string().max(500).optional(),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
