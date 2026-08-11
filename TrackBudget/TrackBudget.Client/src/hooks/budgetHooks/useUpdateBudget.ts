import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateBudget } from "../../api/budgetApi";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { notify } from "../../utils/toast";

import { budgetKeys } from "./useBudgets";

import type { UpdateBudget } from "../../types/budget";

interface UseUpdateBudgetPayload {
    budgetId: string;
    request: UpdateBudget;
}

export function useUpdateBudget() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ budgetId, request }: UseUpdateBudgetPayload) => {
            if (!budgetId) {
                throw new Error("Budget ID is required.");
            }

            return updateBudget(budgetId, request);
        },
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: budgetKeys.lists() }),
                queryClient.invalidateQueries({ queryKey: budgetKeys.all }),
            ]);
            notify.success("Budget updated successfully");
        },
        onError: (error: unknown) => {
            const errorMessage = getApiErrorMessage(error);
            notify.error(`Failed to update budget: ${errorMessage}`);
        },
    });
}
