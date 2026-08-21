import { useMutation } from "@tanstack/react-query";

import { confirmCsvImport } from "../../api/ImportApi";

export function useConfirmCsvImport() {
    return useMutation({
        mutationFn: confirmCsvImport,
    });
}