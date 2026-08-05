import { useState } from "react";

import { Button } from "../../components/common/Button/Button";
import { EmptyState } from "../../components/common/EmptyState/EmptyState";
import { ErrorState } from "../../components/common/ErrorState/ErrorState";
import { LoadingState } from "../../components/common/LoadingState/LoadingState";

import { CreateTransactionModal } from "../../components/transaction/CreateTransactionModal/CreateTransactionModal";
import { EditTransactionModal } from "../../components/transaction/EditTransactionModal/EditTransactionModal";
import { TransactionList } from "../../components/transaction/TransactionList/TransactionList";
import { DeleteTransactionDialog } from "../../components/transaction/DeleteTransactionDialog/DeleteTransactionDialog";

import { useAccounts } from "../../hooks/accountsHooks/useAccounts";
import { useTransactions } from "../../hooks/transactionHooks/useTransactions";

import type { Currency } from "../../types/account";
import type { Transaction } from "../../types/transaction";

import styles from "./TransactionPage.module.scss";

export function TransactionPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: transactions = [], isLoading, error } = useTransactions();
  const { data: accounts = [] } = useAccounts();

  const accountCurrencyById = accounts.reduce(
    (map, account) => {
      map[account.id] = account.currency;
      return map;
    },
    {} as Record<string, Currency>,
  );

  const handleEdit = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setIsEditOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditOpen(false);
    setTransactionToEdit(null);
  };

  const handleDelete = (transactionId: string) => {
    const transaction = transactions.find((item) => item.id === transactionId);

    if (!transaction) {
      return;
    }

    setTransactionToEdit(transaction);
    setIsDeleteOpen(true);
  };

  if (isLoading) {
    return <LoadingState message=" Loading transactions..." />;
  }
  if (error) {
    return (
      <ErrorState
        title="Failed to load transactions."
        description="Please try again in a moment."
      />
    );
  }

  if (transactions.length === 0) {
    return <EmptyState 
    title="No Transactions" 
    description="Create your first transaction to start tracking your finances."
    actionLabel="+ New Transaction"
    onActionClick={() => setIsCreateOpen(true)}
  />;
  }

  return (
    <div className={styles.transactionPage}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Transactions</h1>
          <p className={styles.subtitle}>Manage your transactions</p>
        </div>

        <Button onClick={() => setIsCreateOpen(true)}>+ New Transaction</Button>
      </div>

      <TransactionList
        transactions={transactions}
        accountCurrencyById={accountCurrencyById}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CreateTransactionModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <EditTransactionModal
        transaction={transactionToEdit}
        isOpen={isEditOpen}
        onClose={handleCloseEditModal}
      />

      {isDeleteOpen && (
        <DeleteTransactionDialog
          transaction={transactionToEdit}
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
        />
      )}
    </div>
  );
}
