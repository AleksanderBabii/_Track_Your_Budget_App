import { useMutation } from "@tanstack/react-query";

import { previewCsvImport } from "../../api/ImportApi";

export function usePreviewCsvImport() {
  return useMutation({
    mutationFn: ({ file, accountId }: { file: File; accountId: string }) =>
      previewCsvImport(file, accountId),
  });
}
