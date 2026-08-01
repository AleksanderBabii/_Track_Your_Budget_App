import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteAccount } from "../../api/accountApi";
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

            toast.success("Account deleted successfully");
        },

        onError: (error) => {
            // Keep error handling consistent with other account mutations.
            const errorMessage = getApiErrorMessage(error);
            toast.error(`Failed to delete account: ${errorMessage}`);
        }
    });   
}