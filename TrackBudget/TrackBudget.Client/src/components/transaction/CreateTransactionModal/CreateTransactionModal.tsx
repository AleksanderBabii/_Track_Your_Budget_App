import { Modal } from "../../common/Modal/Modal";
import { notify } from "../../../utils/toast";

import { TransactionForm } from "../TransactionForm/TransactionForm";

import { useCreateTransaction } from "../../../hooks/transactionHooks/useCreateTransactions";
import { useCategories } from "../../../hooks/categoryHooks/useCategories";

import type { TransactionFormValues } from "../../../utils/transactionSchema";

import styles from "./CreateTransactionModal.module.scss";

interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTransactionModal({
  isOpen,
  onClose,
}: CreateTransactionModalProps) {
  const createTransactionMutation = useCreateTransaction();

  const { data: categories = [] } = useCategories();

  async function handleSubmit(values: TransactionFormValues) {
    const category = categories.find((c) => c.id === values.categoryId);

    if (!category) {
      notify.error("Please select a valid category before saving.");
      return;
    }

    const transactionDate = values.date ? values.date.toISOString() : "";

    await createTransactionMutation.mutateAsync({
      title: values.title,
      amount: values.amount,
      accountId: values.accountId,
      categoryId: values.categoryId,
      date: transactionDate,
      notes: values.notes,
      type: category.type,
    });

    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Transaction">
      <div className={styles.content}>
        <p className={styles.description}>Record a new income or expense.</p>

        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="Create Transaction"
          isSubmitting={createTransactionMutation.isPending}
        />
      </div>
    </Modal>
  );
}
