export type TransactionType = "Income" | "Expense";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  accountId: string;
  accountName: string;
  categoryId: string;
  categoryName?: string;
  date: string;
  notes?: string;
  type: TransactionType;
  createdAt: string;
}

export interface CreateTransactionRequest {
  title: string;
  amount: number;
  accountId: string;
  categoryId: string;
  date: string;
  notes?: string;
  type: TransactionType;
}

export interface UpdateTransactionRequest {
  title?: string;
  amount?: number;
  accountId?: string;
  categoryId?: string;
  date?: string;
  notes?: string;
  type?: TransactionType;
}
