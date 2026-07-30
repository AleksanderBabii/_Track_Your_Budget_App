import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateCategory } from "../api/categoryApi";
import { categoryKeys } from "./useCategories";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, request }: { categoryId: string; request: { name?: string; type?: "Income" | "Expense" } }) =>
      updateCategory(categoryId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success("Category updated successfully");
    },
    onError: (error) => {
      const errorMessage = getApiErrorMessage(error);
      toast.error(`Failed to update category: ${errorMessage}`);
    },
  });
}
