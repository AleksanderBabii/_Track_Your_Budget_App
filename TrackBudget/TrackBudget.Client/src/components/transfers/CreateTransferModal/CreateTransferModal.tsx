import { Modal } from "../../common/Modal/Modal";

import { TransferForm } from "../TransferForm/TransferForm";

import { useCreateTransfer } from "../../../hooks/transfersHooks/useCreateTransfer";
import { useTransferFormSubmission } from "../../../hooks/transfersHooks/useTransferFormSubmission";

import type { TransferFormValues } from "../../../utils/transferSchema";

import styles from "./CreateTransferModal.module.scss";

interface CreateTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTransferModal({
  isOpen,
  onClose,
}: CreateTransferModalProps) {
    const createTransferMutation = useCreateTransfer();
    const { submitTransfer } = useTransferFormSubmission();

    async function handleSubmit(values: TransferFormValues) {
        const payload = await submitTransfer(values);

        if (!payload) {
            return;
        }

        await createTransferMutation.mutateAsync(payload);
        onClose();
    }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Transfer">
      <div className={styles.content}>
        <p className={styles.description}>Record a new transfer between accounts.</p>

        <TransferForm
          onSubmit={handleSubmit}
          onCancel={onClose}
            submitLabel="Create Transfer"   
         isSubmitting={createTransferMutation.isPending}
        />
      </div>
    </Modal>
  );
}