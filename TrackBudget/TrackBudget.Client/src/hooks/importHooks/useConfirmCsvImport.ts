import { useMutation, useQueryClient } from "@tanstack/react-query";

import { confirmCsvImport } from "../../api/ImportApi";
import type { ConfirmImportRequest } from "../../types/import";

export function useConfirmCsvImport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ConfirmImportRequest) =>
      confirmCsvImport(request),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["transactions"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["accounts"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["reports"],
        }),
      ]);
    },
  });
}