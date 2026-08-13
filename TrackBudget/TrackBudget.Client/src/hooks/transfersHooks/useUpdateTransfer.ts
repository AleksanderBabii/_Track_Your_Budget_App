import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTransfer } from "../../api/transferApi";
import { notify } from "../../utils/toast";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

import { transferKeys } from "./useTransfers";

import type { UpdateTransfer } from "../../types/transfer";

interface UpdateTransferPayload {
  transferId: string;
  request: UpdateTransfer;
}

export function useUpdateTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ transferId, request }: UpdateTransferPayload) =>
      updateTransfer(transferId, request),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: transferKeys.all,
      });

      notify.success("Transfer updated successfully");
    },

    onError: (error) => {
      const errorMessage = getApiErrorMessage(error);
      notify.error(`Failed to update transfer: ${errorMessage}`);
    },
  });
}
