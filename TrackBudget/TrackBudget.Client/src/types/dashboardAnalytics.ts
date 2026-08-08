export interface DashboardAnalytics {
    incomeExpenseAnalytics: IncomeExpenseAnalytics[];
    categoryAnalytics: CategoryAnalytics[];
    monthlyBalanceAnalytics: MonthlyBalanceAnalytics[];
}

export interface IncomeExpenseAnalytics {
    income: number;
    expenses: number;
    month: string;
}

export interface CategoryAnalytics {
    category: string;
    total: number;
}

export interface MonthlyBalanceAnalytics {
    date: string;
    balance: number;
}
