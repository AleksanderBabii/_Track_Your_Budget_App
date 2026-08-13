import { useQuery } from "@tanstack/react-query";

import { getTransfers } from "../../api/transferApi";

export const transferKeys = {
  all: ["transfers"] as const,
};

export function useTransfers() {
  return useQuery({ queryKey: transferKeys.all, queryFn: getTransfers });
}
