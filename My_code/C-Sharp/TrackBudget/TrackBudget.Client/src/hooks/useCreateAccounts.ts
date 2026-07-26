import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createAccount } from "../api/accountApi";
import { accountKeys } from "./useAccounts";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAccount,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: accountKeys.all,
      });

      toast.success("Account created successfully");
    },

    onError: (error) => {
      const errorMessage = getApiErrorMessage(error);
      toast.error(`Failed to create account: ${errorMessage}`);
    },
  });
}
