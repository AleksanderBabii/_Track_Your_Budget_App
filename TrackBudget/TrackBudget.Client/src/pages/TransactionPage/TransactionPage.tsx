import { useState } from "react";

import { Button } from "../../components/common/Button/Button";

import { CreateTransactionModal } from "../../components/transaction/CreateTransactionModal/CreateTransactionModal";
import { EditTransactionModal } from "../../components/transaction/EditTransactionModal/EditTransactionModal";
import { TransactionList } from "../../components/transaction/TransactionList/TransactionList";

import { useAccounts } from "../../hooks/accountsHooks/useAccounts";
import { useDeleteTransaction } from "../../hooks/transactionHooks/useDeleteTransactions";
import { useTransactions } from "../../hooks/transactionHooks/useTransactions";

import type { Currency } from "../../types/account";
import type { Transaction } from "../../types/transaction";

import styles from "./TransactionPage.module.scss";

export function TransactionPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);

  const { data: transactions = [], isLoading, error } = useTransactions();
  const { data: accounts = [] } = useAccounts();
  const deleteTransactionMutation = useDeleteTransaction();

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
    deleteTransactionMutation.mutate(transactionId);
  };

  if (isLoading) {
    return <div className={styles.state}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.state}>Error: {error.message}</div>;
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

      {/* Delete dialog will go here */}
    </div>
  );
}
