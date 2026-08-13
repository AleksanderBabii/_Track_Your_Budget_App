import { notify } from "../../utils/toast";

import { useCategories } from "../categoryHooks/useCategories";

import type { TransactionFormValues } from "../../utils/transactionSchema";

export function useTransactionFormSubmission({
  onSuccess,
}: {
  onSuccess?: () => void;
} = {}) {
  const { data: categories = [] } = useCategories();

  const submitTransaction = async (values: TransactionFormValues) => {
    const category = categories.find((item) => item.id === values.categoryId);

    if (!category) {
      notify.error("Please select a valid category before saving.");
      return false;
    }

    const payload = {
      title: values.title,
      amount: values.amount,
      accountId: values.accountId,
      categoryId: values.categoryId,
      date: values.date.toISOString(),
      notes: values.notes,
      type: category.type,
    };

    onSuccess?.();
    return payload;
  };

  return { submitTransaction };
}
