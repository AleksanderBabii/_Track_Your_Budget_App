import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Transfer } from "../../types/transfer";

import { deleteTransfer } from "../../api/transferApi";
import { notify } from "../../utils/toast";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

import { transferKeys } from "./useTransfers";

export function useDeleteTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransfer,

    onMutate: async (transferId: string) => {
      await queryClient.cancelQueries({ queryKey: transferKeys.all });

      const previousTransfers = queryClient.getQueryData<Transfer[]>(
        transferKeys.all,
      );

      queryClient.setQueryData<Transfer[]>(transferKeys.all, (old) =>
        old ? old.filter((transfer) => transfer.id !== transferId) : [],
      );

      return { previousTransfers };
    },

    onError: (error, _transferId, context) => {
      if (context?.previousTransfers) {
        queryClient.setQueryData(transferKeys.all, context.previousTransfers);
      }
      const errorMessage = getApiErrorMessage(error);
      notify.error(`Failed to delete transfer: ${errorMessage}`);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: transferKeys.all });
      notify.success("Transfer deleted successfully");
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: transferKeys.all });
    },
  });
}
