import { useState } from "react";
import { FiPlus } from "react-icons/fi";

import { Button } from "../../components/common/Button/Button";
import { PageContainer } from "../../components/layout/PageContainer/PageContainer";
import { CreateAccountModal } from "../../components/accounts/CreateAccountModal/CreateAccountModal";

import styles from "./Accounts.module.scss";

export function Accounts() {
  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false);

  return (
    <PageContainer>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Accounts</h1>

          <p className={styles.description}>
            Manage your bank accounts, cash and balances.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <FiPlus aria-hidden="true" />
          New account
        </Button>
      </div>

      <CreateAccountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </PageContainer>
  );
}