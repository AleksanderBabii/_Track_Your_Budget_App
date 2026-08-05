import  {useMutation, useQueryClient} from "@tanstack/react-query";

import { createTransaction } from "../../api/transactionApi";
import { notify } from "../../utils/toast";
import { transactionKeys } from "./useTransactions";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

export function useCreateTransaction() {
  const queryClient = useQueryClient();

    return useMutation({
        // Sends POST /transactions request.
        mutationFn: createTransaction,

        onSuccess: async () => {
            // Refresh transaction list so newly created transaction appears immediately.
            await queryClient.invalidateQueries({
                queryKey: transactionKeys.all,
            });

            notify.success("Transaction created successfully");
        },

        onError: (error) => {
            // Normalize API error shape for user-friendly toast output.
            const errorMessage = getApiErrorMessage(error);
            notify.error(`Failed to create transaction: ${errorMessage}`);
        },
    });
}