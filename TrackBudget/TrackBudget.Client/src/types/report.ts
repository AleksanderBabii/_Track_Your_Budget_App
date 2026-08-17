export interface ReportSummary {
  totalIncome: number;
  totalExpenses: number;
  netChange: number;
  transactionCount: number;
  totalTransfers: number;
  transferCount: number;
}

export interface ReportCategory {
  categoryId: string;
  categoryName: string;
  amount: number;
  transactionCount: number;
}

export interface ReportTransfer {
  transferId: string;
  amount: number;
  date: string;
  notes?: string | null;
  fromAccountId: string;
  fromAccountName: string;
  toAccountId: string;
  toAccountName: string;
}

export interface ReportMonthly {
  month: string;
  totalIncome: number;
  totalExpenses: number;
}

export interface Report {
  from: string;
  to: string;
  summary: ReportSummary;
  expensesByCategory: ReportCategory[];
  incomeByCategory: ReportCategory[];
  transfers: ReportTransfer[];
  monthlyReport: ReportMonthly[];
}