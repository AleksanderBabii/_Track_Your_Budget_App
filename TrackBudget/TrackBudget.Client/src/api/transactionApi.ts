import { api } from "./axios";

import type {
  Transaction,
  CreateTransactionRequest,
  UpdateTransactionRequest,
} from "../types/transaction";

export async function getTransactions(): Promise<Transaction[]> {
  const response = await api.get<Transaction[]>("/transactions");
  return response.data;
}

export async function createTransaction(
  request: CreateTransactionRequest,
): Promise<Transaction> {
  const response = await api.post<Transaction>("/transactions", request);
  return response.data;
}

export async function updateTransaction(
  transactionId: string,
  request: UpdateTransactionRequest,
): Promise<Transaction> {
  const response = await api.put<Transaction>(
    `/transactions/${transactionId}`,
    request,
  );
  return response.data;
}

export async function deleteTransaction(transactionId: string): Promise<void> {
  await api.delete(`/transactions/${transactionId}`);
}
