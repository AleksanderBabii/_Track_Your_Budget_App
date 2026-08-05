import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Transaction } from "../../types/transaction";

import { deleteTransaction } from "../../api/transactionApi";
import { notify } from "../../utils/toast";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

import { transactionKeys } from "./useTransactions";

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,

    onMutate: async (transactionId: string) => {
      await queryClient.cancelQueries({ queryKey: transactionKeys.all });

      const previousTransactions = queryClient.getQueryData<Transaction[]>(
        transactionKeys.all,
      );

      queryClient.setQueryData<Transaction[]>(transactionKeys.all, (old) =>
        old
          ? old.filter((transaction) => transaction.id !== transactionId)
          : [],
      );

      return { previousTransactions };
    },

    onError: (error, _transactionId, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(
          transactionKeys.all,
          context.previousTransactions,
        );
      }

      const errorMessage = getApiErrorMessage(error);
      notify.error(`Failed to delete transaction: ${errorMessage}`);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      notify.success("Transaction deleted successfully");
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}
