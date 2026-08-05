import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTransaction } from "../../api/transactionApi";
import { notify } from "../../utils/toast";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

import { transactionKeys } from "./useTransactions";

import type { UpdateTransactionRequest } from "../../types/transaction";

interface UpdateTransactionPayload {
	transactionId: string;
	request: UpdateTransactionRequest;
}

export function useUpdateTransaction() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ transactionId, request }: UpdateTransactionPayload) =>
			updateTransaction(transactionId, request),

		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: transactionKeys.all,
			});

			notify.success("Transaction updated successfully");
		},

		onError: (error) => {
			const errorMessage = getApiErrorMessage(error);
			notify.error(`Failed to update transaction: ${errorMessage}`);
		},
	});
}
