export interface Report {
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  incomeByCategory: Record<string, number>;
  expenseByCategory: Record<string, number>;
}