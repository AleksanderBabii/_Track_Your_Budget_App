import { notify } from "../../utils/toast";

import { useAccounts } from "../accountsHooks/useAccounts";

import type { TransferFormValues } from "../../utils/transferSchema";

export function useTransferFormSubmission({
  onSuccess,
}: {
  onSuccess?: () => void;
} = {}) {
    const { data: accounts = [] } = useAccounts();

    const submitTransfer = async (values: TransferFormValues) => {
    const fromAccount = accounts.find((item) => item.id === values.fromAccountId);
    const toAccount = accounts.find((item) => item.id === values.toAccountId);

    if (!fromAccount) {
      notify.error("Please select a valid source account before saving.");
      return false;
    }
    if (!toAccount) {
      notify.error("Please select a valid destination account before saving.");
      return false;
    }
    
    const payload = {
        title: values.title,
        amount: values.amount,
        fromAccountId: values.fromAccountId,
        toAccountId: values.toAccountId,
        date: values.date.toISOString(),
        notes: values.notes,
        fromAccountName: fromAccount?.name ?? "",
        toAccountName: toAccount?.name ?? "",
    };

    onSuccess?.();
    return payload;
  };

  return { submitTransfer };
}