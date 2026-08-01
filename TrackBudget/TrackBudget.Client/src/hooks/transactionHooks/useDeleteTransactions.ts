import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteTransaction } from "../../api/transactionApi";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

import { transactionKeys } from "./useTransactions";

export function useDeleteTransaction() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteTransaction,

		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: transactionKeys.all,
			});

			toast.success("Transaction deleted successfully");
		},

		onError: (error) => {
			const errorMessage = getApiErrorMessage(error);
			toast.error(`Failed to delete transaction: ${errorMessage}`);
		},
	});
}
