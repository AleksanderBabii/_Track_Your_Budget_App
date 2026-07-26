import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteAccount } from "../api/accountApi";
import { accountKeys } from "./useAccounts";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

export function useDeleteAccount() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAccount,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: accountKeys.all});

            toast.success("Account deleted successfully");
        },

        onError: (error) => {
            const errorMessage = getApiErrorMessage(error);
            toast.error(`Failed to delete account: ${errorMessage}`);
        }
    });   
}