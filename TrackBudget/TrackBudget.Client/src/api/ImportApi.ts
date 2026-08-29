import { api } from "./axios";

import type { ImportPreview, ConfirmImportRequest } from "../types/import";
import type { Transaction } from "../types/transaction";

export async function previewCsvImport(
    file: File,
    accountId: string,
): Promise<ImportPreview> {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("accountId", accountId);

    const response = await api.post<ImportPreview>("/transactions/import/preview", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

export async function confirmCsvImport(
  request: ConfirmImportRequest,
): Promise<Transaction[]> {
  const response = await api.post<Transaction[]>(
    "/transactions/import/confirm",
    request,
  );

  return response.data;
}