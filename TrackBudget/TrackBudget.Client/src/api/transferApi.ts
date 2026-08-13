import { api } from "./axios";

import type { Transfer, CreateTransfer, UpdateTransfer } from "../types/transfer";

export async function getTransfers(): Promise<Transfer[]> {
    const response = await api.get<Transfer[]>("/transfers");
    return response.data;
}

export async function getTransfer(id: string): Promise<Transfer> {
    const response = await api.get<Transfer>(`/transfers/${id}`);
    return response.data;
}

export async function createTransfer(transfer: CreateTransfer): Promise<Transfer> {
    const response = await api.post<Transfer>("/transfers", transfer);
    return response.data;
}

export async function updateTransfer(id: string, transfer: UpdateTransfer): Promise<Transfer> {
    const response = await api.put<Transfer>(`/transfers/${id}`, transfer);
    return response.data;
}

export async function deleteTransfer(id: string): Promise<void> {
    await api.delete(`/transfers/${id}`);
}