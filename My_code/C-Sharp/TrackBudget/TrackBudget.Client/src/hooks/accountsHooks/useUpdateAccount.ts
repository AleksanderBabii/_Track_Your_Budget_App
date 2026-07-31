import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateAccount } from "../../api/accountApi";

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      accountId,
      request,
    }: {
      accountId: string;
      request: {
        name: string;
        currency: string;
      };
    }) => updateAccount(accountId, request),

    onSuccess: () => {
      // Invalidate and refetch the accounts query to reflect the updated account.
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error) => {
      console.error("Error updating account:", error);
    },
  });
}
