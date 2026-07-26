import { api } from "./axios";

import type { Account, CreateAccountRequest } from "../types/account";

export async function getAccounts(): Promise<Account[]> {
  const response = await api.get<Account[]>("/accounts");
  return response.data;
}

export async function createAccount(
  request: CreateAccountRequest,
): Promise<Account> {
  const response = await api.post<Account>("/accounts", request);
  return response.data;
}

export async function deleteAccount(accountId: string): Promise<void> {
  await api.delete(`/accounts/${accountId}`);
}
