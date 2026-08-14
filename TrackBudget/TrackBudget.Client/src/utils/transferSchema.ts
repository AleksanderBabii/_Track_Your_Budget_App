import { z } from "zod";

export const transferSchema = z.object({
    accountId: z
        .string()
        .uuid("Please select an account."),
        
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
        
    fromAccountId: z
        .string()
        .uuid("Please select a source account."),

    toAccountId: z
        .string()
        .uuid("Please select a destination account."),

    date: z.date(),

    notes: z
        .string()
        .max(500)
        .optional(),
});

export type TransferFormValues =
    z.infer<typeof transferSchema>;