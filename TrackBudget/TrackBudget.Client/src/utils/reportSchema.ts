import { z } from "zod";

export const reportSchema = z.object({
    totalIncome: z.number().nonnegative("Total income cannot be negative."),
    totalExpense: z.number().nonnegative("Total expense cannot be negative."),
    netIncome: z.number(),
    incomeByCategory: z.record(z.string(), z.number().nonnegative("Income by category cannot be negative.")),
    expenseByCategory: z.record(z.string(), z.number().nonnegative("Expense by category cannot be negative.")),
});