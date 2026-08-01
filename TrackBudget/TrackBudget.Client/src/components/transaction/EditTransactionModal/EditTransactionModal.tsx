import toast from "react-hot-toast";

import { Modal } from "../../common/Modal/Modal";
import { TransactionForm } from "../TransactionForm/TransactionForm";

import { useCategories } from "../../../hooks/categoryHooks/useCategories";
import { useUpdateTransaction } from "../../../hooks/transactionHooks/useUpdateTransactions";

import type { Transaction } from "../../../types/transaction";
import type { TransactionFormValues } from "../../../utils/transactionSchema";

import styles from "./EditTransactionModal.module.scss";

interface EditTransactionModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditTransactionModal({
  transaction,
  isOpen,
  onClose,
}: EditTransactionModalProps) {
  const updateTransactionMutation = useUpdateTransaction();
  const { data: categories = [] } = useCategories();

  if (!transaction) {
    return null;
  }

  const currentTransaction = transaction;

  async function handleSubmit(values: TransactionFormValues) {
    const category = categories.find((item) => item.id === values.categoryId);

    if (!category) {
      toast.error("Please select a valid category before saving.");
      return;
    }

    await updateTransactionMutation.mutateAsync({
      transactionId: currentTransaction.id,
      request: {
        title: values.title,
        amount: values.amount,
        accountId: values.accountId,
        categoryId: values.categoryId,
        date: values.date.toISOString(),
        notes: values.notes,
        type: category.type,
      },
    });

    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Transaction">
      <div className={styles.content}>
        <p className={styles.description}>Update your transaction details.</p>

        <TransactionForm
          defaultValues={{
            title: currentTransaction.title,
            amount: currentTransaction.amount,
            accountId: currentTransaction.accountId,
            categoryId: currentTransaction.categoryId,
            date: new Date(currentTransaction.date),
            notes: currentTransaction.notes ?? "",
          }}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="Update Transaction"
          isSubmitting={updateTransactionMutation.isPending}
        />
      </div>
    </Modal>
  );
}
