import { api } from "./axios";

import type { Account, CreateAccountRequest } from "../types/account";

// Request payload for updating an account.
export interface UpdateAccountRequest {
  name?: string;
  balance?: number;
  currency?: string;
}

// Fetch all accounts for the authenticated user.
export async function getAccounts(): Promise<Account[]> {
  const response = await api.get<Account[]>("/accounts");
  return response.data;
}

// Create a new account and return the created entity.
export async function createAccount(
  request: CreateAccountRequest,
): Promise<Account> {
  const response = await api.post<Account>("/accounts", request);
  return response.data;
}

// Update an existing account by id and return the updated entity.
export async function updateAccount(
  accountId: string,
  request: UpdateAccountRequest,
): Promise<Account> {
  const response = await api.put<Account>(`/accounts/${accountId}`, request);
  return response.data;
}

// Delete one account by id.
export async function deleteAccount(accountId: string): Promise<void> {
  await api.delete(`/accounts/${accountId}`);
}
