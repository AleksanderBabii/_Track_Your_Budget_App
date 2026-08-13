import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { deleteAccount } from "../../api/accountApi";
import { notify } from "../../utils/toast";
import { accountKeys } from "./useAccounts";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

export function useDeleteAccount() {
    const queryClient = useQueryClient();

    return useMutation({
        // Sends DELETE /accounts/:id.
        mutationFn: deleteAccount,
        onSuccess: async () => {
            // Refetch list so deleted card disappears without manual refresh.
            await queryClient.invalidateQueries({queryKey: accountKeys.all});

            notify.success("Account deleted successfully");
        },

        onError: (error) => {
            // Keep error handling consistent with other account mutations.
            const errorMessage = getApiErrorMessage(error);
            notify.error(`Failed to delete account: ${errorMessage}`);
        }
    });   
}