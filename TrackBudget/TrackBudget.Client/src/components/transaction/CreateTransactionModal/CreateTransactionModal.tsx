import { Modal } from "../../common/Modal/Modal";

import { TransactionForm } from "../TransactionForm/TransactionForm";

import { useCreateTransaction } from "../../../hooks/transactionsHooks/useCreateTransactions";
import { useTransactionFormSubmission } from "../../../hooks/transactionsHooks/useTransactionFormSubmission";

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
  const { submitTransaction } = useTransactionFormSubmission();

  async function handleSubmit(values: TransactionFormValues) {
    const payload = await submitTransaction(values);

    if (!payload) {
      return;
    }

    await createTransactionMutation.mutateAsync(payload);
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
