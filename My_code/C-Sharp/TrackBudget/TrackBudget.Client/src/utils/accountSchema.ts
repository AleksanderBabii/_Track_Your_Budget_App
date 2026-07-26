import { z } from "zod";

export const accountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Account name is required")
    .max(20, "Account name must be less than 20 characters"),

  initialBalance: z
    .number({ error: "Initial balance must be a number" })
    .min(0, "Initial balance must be greater than or equal to 0"),

  currency: z.enum(["USD", "EUR", "GBP", "JPY", "CAD", "AUD"]),
});

export type AccountFormValues = z.infer<typeof accountSchema>;
