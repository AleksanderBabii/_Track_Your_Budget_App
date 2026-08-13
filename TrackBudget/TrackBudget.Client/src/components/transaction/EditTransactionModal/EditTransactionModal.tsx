import { Modal } from "../../common/Modal/Modal";
import { TransactionForm } from "../TransactionForm/TransactionForm";

import { useUpdateTransaction } from "../../../hooks/transactionsHooks/useUpdateTransactions";
import { useTransactionFormSubmission } from "../../../hooks/transactionsHooks/useTransactionFormSubmission";

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
  const { submitTransaction } = useTransactionFormSubmission();

  if (!transaction) {
    return null;
  }

  const currentTransaction = transaction;

  async function handleSubmit(values: TransactionFormValues) {
    const payload = await submitTransaction(values);

    if (!payload) {
      return;
    }

    await updateTransactionMutation.mutateAsync({
      transactionId: currentTransaction.id,
      request: payload,
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
