import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createCategory } from "../api/categoryApi";
import { categoryKeys } from "./useCategories";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success("Category created successfully");
    },
    onError: (error) => {
      const errorMessage = getApiErrorMessage(error);
      toast.error(`Failed to create category: ${errorMessage}`);
    },
  });
}
