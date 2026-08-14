import type { Transaction } from "./transaction";

export interface Dashboard {
  accountsCount: number;
  categoriesCount: number;
  transactionsCount: number;
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  recentTransactions: Transaction[];
}
