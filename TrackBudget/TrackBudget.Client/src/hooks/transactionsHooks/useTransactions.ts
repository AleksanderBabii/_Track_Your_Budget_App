import {useQuery } from "@tanstack/react-query";

import { getTransactions } from "../../api/transactionApi";

export const transactionKeys = {
  all: ["transactions"] as const,
};

export function useTransactions() {
  return useQuery({ queryKey: transactionKeys.all, queryFn: getTransactions });
}
