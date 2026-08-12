import type { BudgetFormValues } from "../../utils/budgetSchema";

export function useBudgetFormSubmission() {
  return (values: BudgetFormValues) => ({
    categoryId: values.categoryId,
    categoryName: values.categoryName,
    limit: values.limit,
    month: values.month,
    year: values.year,
  });
}