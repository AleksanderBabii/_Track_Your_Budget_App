import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteBudget } from "../../api/budgetApi";
import { notify } from "../../utils/toast";
import {getApiErrorMessage} from "../../utils/getApiErrorMessage";

import { budgetKeys } from "./useBudgets";

export function useDeleteBudget() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteBudget,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: budgetKeys.all });
            notify.success("Budget deleted successfully!");
        },
        onError: (error) => {
            const errorMessage = getApiErrorMessage(error);
            notify.error(`Failed to delete budget: ${errorMessage}`);
        },
    });
}