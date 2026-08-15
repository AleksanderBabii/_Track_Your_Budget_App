import { useQuery } from "@tanstack/react-query";

import { getReport } from "../../api/reportApi";

export const reportKeys = {
  all: ["report"] as const,
};

export function useReport(fromDate: string, toDate: string) {
  return useQuery({
    queryKey: [...reportKeys.all, fromDate, toDate],
    queryFn: () => getReport(fromDate, toDate),
  });
}