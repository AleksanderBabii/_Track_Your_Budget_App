import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTransfer } from "../../api/transferApi";
import { notify } from "../../utils/toast";
import { transferKeys } from "./useTransfers";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

export function useCreateTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    // Sends POST /transfers request.
    mutationFn: createTransfer,

    onSuccess: async () => {
      // Refresh transfer list so newly created transfer appears immediately.
      await queryClient.invalidateQueries({
        queryKey: transferKeys.all,
      });

      notify.success("Transfer created successfully");
    },

    onError: (error) => {
      // Normalize API error shape for user-friendly toast output.
      const errorMessage = getApiErrorMessage(error);
      notify.error(`Failed to create transfer: ${errorMessage}`);
    },
  });
}
