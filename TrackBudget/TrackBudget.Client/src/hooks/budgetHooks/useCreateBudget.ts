import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createBudget } from "../../api/budgetApi";
import { notify } from "../../utils/toast";
import {getApiErrorMessage} from "../../utils/getApiErrorMessage";

import { budgetKeys } from "./useBudgets";

export function useCreateBudget() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createBudget,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: budgetKeys.all });
            notify.success("Budget created successfully!");
        },
        onError: (error) => {
            const errorMessage = getApiErrorMessage(error);
            notify.error(`Failed to create budget: ${errorMessage}`);
        },
    });
}