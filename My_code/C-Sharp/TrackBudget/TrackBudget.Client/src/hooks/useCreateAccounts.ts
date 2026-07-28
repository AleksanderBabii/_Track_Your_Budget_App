import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createAccount } from "../api/accountApi";
import { accountKeys } from "./useAccounts";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    // Sends POST /accounts request.
    mutationFn: createAccount,

    onSuccess: async () => {
      // Refresh account list so newly created account appears immediately.
      await queryClient.invalidateQueries({
        queryKey: accountKeys.all,
      });

      toast.success("Account created successfully");
    },

    onError: (error) => {
      // Normalize API error shape for user-friendly toast output.
      const errorMessage = getApiErrorMessage(error);
      toast.error(`Failed to create account: ${errorMessage}`);
    },
  });
}
