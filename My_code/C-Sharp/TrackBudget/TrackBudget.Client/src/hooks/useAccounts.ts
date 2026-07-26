import { useQuery } from "@tanstack/react-query";

import { getAccounts } from "../api/accountApi";

export const accountKeys = {
  all: ["accounts"] as const,
};

export function useAccounts() {
  return useQuery({ queryKey: accountKeys.all, queryFn: getAccounts });
}
