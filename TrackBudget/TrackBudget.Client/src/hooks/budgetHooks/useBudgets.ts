import { useQuery } from "@tanstack/react-query";

import { getBudgets } from "../../api/budgetApi";


export const budgetKeys = {
    all: ["budgets"] as const,
    lists: () => [...budgetKeys.all, "list"] as const,
    list: (filters: string) => [...budgetKeys.lists(), { filters }] as const,
    details: () => [...budgetKeys.all, "detail"] as const,
    detail: (id: string) => [...budgetKeys.details(), id] as const,
};

export function useBudgets() {
    return useQuery({
        queryKey: budgetKeys.list("all"),
        queryFn: () => getBudgets(),
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    });
}