import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteCategory } from "../../api/categoryApi";
import { notify } from "../../utils/toast";
import { categoryKeys } from "./useCategories";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      notify.success("Category deleted successfully");
    },
    onError: (error) => {
      const errorMessage = getApiErrorMessage(error);
      notify.error(`Failed to delete category: ${errorMessage}`);
    },
  });
}
