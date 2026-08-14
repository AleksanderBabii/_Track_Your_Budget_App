import { useCreateAccount } from "../../../hooks/accountsHooks/useCreateAccount";
import type { AccountFormValues } from "../../../utils/accountSchema";
import { Button } from "../../common/Button/Button";
import { Modal } from "../../common/Modal/Modal";
import { AccountForm } from "../AccountForm/AccountForm";

import styles from "./CreateAccountModal.module.scss";

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateAccountModal({
  isOpen,
  onClose,
}: CreateAccountModalProps) {
  // Mutation encapsulates API call + cache refresh + success/error toasts.
  const createAccountMutation = useCreateAccount();

  async function handleSubmit(values: AccountFormValues): Promise<void> {
    // Map validated form values to API contract.
    await createAccountMutation.mutateAsync({
      name: values.name,
      initialBalance: values.initialBalance,
      currency: values.currency,
    });

    // Close modal only after successful create.
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create account">
      <div className={styles.content}>
        <p className={styles.description}>
          Add an account to start tracking its balance and transactions.
        </p>

        <AccountForm
          onSubmit={handleSubmit}
          isSubmitting={createAccountMutation.isPending}
          submitLabel="Create account"
        />
      </div>

      <Button
        type="button"
        variant="secondary"
        onClick={onClose}
        disabled={createAccountMutation.isPending}
      >
        Cancel
      </Button>
    </Modal>
  );
}
