import { api } from "./axios";

import type { Report } from "../types/report";

export async function getReport(fromDate: string, toDate: string): Promise<Report> {
  const response = await api.get<Report>("/reports", {
    params: { from: fromDate, to: toDate },
  });
  return response.data;
}

