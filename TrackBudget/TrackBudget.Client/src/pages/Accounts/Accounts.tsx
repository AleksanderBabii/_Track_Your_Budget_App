import { useState } from "react";
import { FiPlus } from "react-icons/fi";

// Components
import { AccountList } from "../../components/accounts/AccountList/AccountList";
import { Button } from "../../components/common/Button/Button";
import { PageContainer } from "../../components/layout/PageContainer/PageContainer";
import { CreateAccountModal } from "../../components/accounts/CreateAccountModal/CreateAccountModal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog/ConfirmDialog";
import { EditAccountModal } from "../../components/accounts/EditAccountModal/EditAccountModal";

// Hooks
import { useDeleteAccount } from "../../hooks/accountsHooks/useDeleteAccount";

// Types
import type { Account } from "../../types/account";

// Styles
import styles from "./Accounts.module.scss";

export function Accounts() {
  // Controls CreateAccountModal visibility.
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Controls the account being edited and the account being deleted.
  const [accountToEdit, setAccountToEdit] = useState<Account | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const deleteAccountMutation = useDeleteAccount();

  function handleEditAccount(account: Account) {
    setAccountToDelete(null);
    setAccountToEdit(account);
    setIsEditModalOpen(true);
  }

  function handleDeleteAccount(account: Account) {
    setAccountToEdit(null);
    setIsEditModalOpen(false);
    setAccountToDelete(account);
  }

  async function handleConfirmDelete() {
    if (accountToDelete) {
      await deleteAccountMutation.mutateAsync(accountToDelete.id);
      setAccountToDelete(null);
    }
  }

  function handleCancelDelete() {
    setAccountToDelete(null);
  }

  return (
    <PageContainer>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Accounts</h1>

            <p className={styles.description}>
              Manage your bank accounts, cash and balances.
            </p>
          </div>

          <Button type="button" onClick={() => setIsCreateModalOpen(true)}>
            <FiPlus aria-hidden="true" />
            New account
          </Button>
        </div>

        <AccountList
          // Reuse the same modal opener in empty/list states.
          onCreate={() => setIsCreateModalOpen(true)}
          onDelete={handleDeleteAccount}
          onEdit={handleEditAccount}
        />

        <CreateAccountModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />

        <EditAccountModal
          isOpen={isEditModalOpen}
          account={accountToEdit}
          onClose={() => {
            setIsEditModalOpen(false);
            setAccountToEdit(null);
          }}
        />

        <ConfirmDialog
          isOpen={accountToDelete !== null}
          title="Delete Account"
          message={`Are you sure you want to delete the account "${accountToDelete?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deleteAccountMutation.isPending}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </PageContainer>
  );
}
