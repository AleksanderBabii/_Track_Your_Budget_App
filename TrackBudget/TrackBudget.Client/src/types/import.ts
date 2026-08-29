export type TransactionType = "income" | "expense" | "transfer";

export interface ImportPreviewTransaction {
  rowNumber: number;
  date: string;
  title: string;
  description?: string;
  amount: number;
  type: TransactionType;
  notes?: string;

  categoryId?: string;
  categoryName?: string;

  isDuplicate: boolean;
  error?: string;
}

export interface ImportPreview {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;

  transactions: ImportPreviewTransaction[];
}

export interface ConfirmImportTransaction {
  rowNumber: number;
  date: string;
  title: string;
  amount: number;
  type: TransactionType;
  notes?: string;
  categoryId?: string;
}

export interface ConfirmImportRequest {
  accountId: string;
  transactions: ConfirmImportTransaction[];
}