import type { Transaction } from "./transaction";

export interface Dashboard {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    monthlySavings: number;
    recentTransactions: Transaction[];
}
