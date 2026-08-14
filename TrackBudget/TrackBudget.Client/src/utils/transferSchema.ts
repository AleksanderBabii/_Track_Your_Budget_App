import { z } from "zod";

export const transferSchema = z
  .object({
    amount: z
      .number({
        error: "Amount is required.",
      })
      .positive("Amount must be greater than zero."),

    fromAccountId: z.string().uuid("Please select a source account."),

    toAccountId: z.string().uuid("Please select a destination account."),

    date: z.date({
      error: "Date is required.",
    }),

    notes: z.string().max(500).optional(),
  })
  .refine((data) => data.fromAccountId !== data.toAccountId, {
    message: "Source and destination accounts must be different.",
    path: ["toAccountId"],
  });

export type TransferFormValues = z.infer<typeof transferSchema>;
