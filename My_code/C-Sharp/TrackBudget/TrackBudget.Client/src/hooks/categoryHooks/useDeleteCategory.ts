import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteCategory } from "../../api/categoryApi";
import { categoryKeys } from "./useCategories";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success("Category deleted successfully");
    },
    onError: (error) => {
      const errorMessage = getApiErrorMessage(error);
      toast.error(`Failed to delete category: ${errorMessage}`);
    },
  });
}
