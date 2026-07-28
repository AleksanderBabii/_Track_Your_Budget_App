import { useState } from "react";
import { FiPlus } from "react-icons/fi";

import { AccountList } from "../../components/accounts/AccountList/AccountList";
import type { Account } from "../../types/account";
import { Button } from "../../components/common/Button/Button";
import { PageContainer } from "../../components/layout/PageContainer/PageContainer";
import { CreateAccountModal } from "../../components/accounts/CreateAccountModal/CreateAccountModal";
import { useDeleteAccount } from "../../hooks/useDeleteAccount";
import { ConfirmDialog } from "../../components/common/ConfirmDialog/ConfirmDialog";

import styles from "./Accounts.module.scss";

export function Accounts() {
  // Controls CreateAccountModal visibility.
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Controls ConfirmDialog visibility and selected account for deletion.
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const deleteAccountMutation = useDeleteAccount();

  function handleDeleteAccount(account: Account) {
    // Implement the logic to delete the account here
    setSelectedAccount(account);
    console.log(`Deleting account: ${account.name}`);
  }

    async function handleConfirmDelete() {
    if (selectedAccount) {
      await deleteAccountMutation.mutateAsync(selectedAccount.id);
      setSelectedAccount(null);
    }
  }

  function handleCancelDelete() {
    setSelectedAccount(null);
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
        />

        <CreateAccountModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />

        <ConfirmDialog
          isOpen={selectedAccount !== null}
          title="Delete Account"
          message={`Are you sure you want to delete the account "${selectedAccount?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deleteAccountMutation.isPending}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}/>
      </div>
    </PageContainer>
  );
}

