import { z } from "zod";

export const currencyValues = [ 
  "PLN",
  "EUR",
  "USD",
  "GBP",
  "UAH",
  "JPY",
  "CHF",
  "CAD",
  "AUD",
  "CNY",
] as const;

export const accountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Account name is required")
    .min(2, "Account name must contain at least 2 characters.")
    .max(50, "Account name must be at most 50 characters long"),

  initialBalance: z
    .number({ error: "Initial balance must be a number" })
    .min(0, "Initial balance must be greater than or equal to 0"),

  currency: z.enum(currencyValues, {
    error: () => ({ message: "Currency is required" }),
  }),
});

export type AccountFormValues = z.infer<typeof accountSchema>;
