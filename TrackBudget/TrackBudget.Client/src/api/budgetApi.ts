import { api } from "./axios";

import type {
    Budget,
    CreateBudget,
    UpdateBudget,
} from "../types/budget";

export async function getBudgets(): Promise<Budget[]> {
    const response = await api.get<Budget[]>("/api/budgets");
    return response.data;
}

export async function getBudget(
    budgetId: string
): Promise<Budget> {
    const response = await api.get<Budget>(`/api/budgets/${budgetId}`);
    return response.data;
}

export async function createBudget(
    request: CreateBudget
): Promise<Budget> {
    const response = await api.post<Budget>("/api/budgets", request);
    return response.data;
}

export async function updateBudget(
    budgetId: string,
    request: UpdateBudget
): Promise<Budget> {
    const response = await api.put<Budget>(`/api/budgets/${budgetId}`, request);
    return response.data;
}

export async function deleteBudget(
    budgetId: string
): Promise<void> {
    await api.delete(`/api/budgets/${budgetId}`);
}

