import { ConfirmDialog } from "../../common/ConfirmDialog/ConfirmDialog";
import { useDeleteTransaction } from "../../../hooks/transactionsHooks/useDeleteTransactions";

import type { Transaction } from "../../../types/transaction";

interface DeleteTransactionDialogProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteTransactionDialog({
  transaction,
  isOpen,
  onClose,
}: DeleteTransactionDialogProps) {
  const deleteTransactionMutation = useDeleteTransaction();

  if (!transaction) {
    return null;
  }

  async function handleConfirm() {
    if (!transaction) {
      return;
    }

    await deleteTransactionMutation.mutateAsync(transaction.id);
    onClose();
  }

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Delete Transaction"
      message={`Are you sure you want to delete the transaction "${transaction.title}"? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      variant="danger"
      isLoading={deleteTransactionMutation.isPending}
      onConfirm={handleConfirm}
      onCancel={onClose}
    />
  );
}
  