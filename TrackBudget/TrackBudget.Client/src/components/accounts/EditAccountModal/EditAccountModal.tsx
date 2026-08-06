import { useUpdateAccount } from "../../../hooks/accountHooks/useUpdateAccount";

import type { Account } from "../../../types/account";
import type { AccountFormValues } from "../../../utils/accountSchema";

import { Modal } from "../../common/Modal/Modal";
import { AccountForm } from "../AccountForm/AccountForm";

import styles from "./EditAccountModal.module.scss";

interface EditAccountModalProps {
  account: Account | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditAccountModal = ({
    account,
    isOpen,
    onClose,
}: EditAccountModalProps) => {
    const updateAccountMutation = useUpdateAccount();

    if (!account) {
        return null;
    }

   async function handleSubmit (values: AccountFormValues,) {
        if (!account) {
            return;
        }

        await updateAccountMutation.mutateAsync(
            {
                accountId: account.id,
                request: {
                    name: values.name,
                    currency: values.currency,
                },
            });
        onClose();
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Account"
            >
                <div className={styles.content}>
                    <AccountForm
                        isEditMode={true}
                        defaultValues={{
                            name: account.name,
                            currency: account.currency,
                        }}
                        onSubmit={handleSubmit}
                        onCancel={onClose}
                        submitLabel="Update Account"
                        isSubmitting={updateAccountMutation.isPending}
                    />
                </div>
            </Modal>
    );
}


         


