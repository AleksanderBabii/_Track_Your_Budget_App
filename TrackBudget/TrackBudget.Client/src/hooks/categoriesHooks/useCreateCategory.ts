import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCategory } from "../../api/categoryApi";
import { notify } from "../../utils/toast";
import { categoryKeys } from "./useCategories";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      notify.success("Category created successfully");
    },
    onError: (error) => {
      const errorMessage = getApiErrorMessage(error);
      notify.error(`Failed to create category: ${errorMessage}`);
    },
  });
}
