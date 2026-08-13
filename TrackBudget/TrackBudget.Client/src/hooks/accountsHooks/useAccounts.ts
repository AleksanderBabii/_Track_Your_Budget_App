import { useQuery } from "@tanstack/react-query";

import { getAccounts } from "../../api/accountApi";

export const accountKeys = {
  // Shared query key used for listing and cache invalidation.
  all: ["accounts"] as const,
};

export function useAccounts() {
  // Loads current user's accounts and caches them via React Query.
  return useQuery({ queryKey: accountKeys.all, queryFn: getAccounts });
}
