import { useState } from "react";
import { useMemo } from "react";

import { Button } from "../../components/common/Button/Button";
import { EmptyState } from "../../components/common/EmptyState/EmptyState";
import { ErrorState } from "../../components/common/ErrorState/ErrorState";
import { LoadingState } from "../../components/common/LoadingState/LoadingState";

import { CreateTransactionModal } from "../../components/transaction/CreateTransactionModal/CreateTransactionModal";
import { EditTransactionModal } from "../../components/transaction/EditTransactionModal/EditTransactionModal";
import { TransactionList } from "../../components/transaction/TransactionList/TransactionList";
import { DeleteTransactionDialog } from "../../components/transaction/DeleteTransactionDialog/DeleteTransactionDialog";
import { TransactionFilterBar } from "../../components/transaction/TransactionFilterBar/TransactionFilterBar";


import { useAccounts } from "../../hooks/accountsHooks/useAccounts";
import { useTransactions } from "../../hooks/transactionHooks/useTransactions";

import type { Currency } from "../../types/account";
import type { Transaction } from "../../types/transaction";
import type { TransactionFilters } from "../../types/transactionFilters";

import styles from "./TransactionPage.module.scss";

export function TransactionPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const initialFilters = {
    search: "",
    accountId: null,
    categoryId: null,
    type: "All",
    sortBy: "newest",
    startDate: null,
    endDate: null,
  } satisfies TransactionFilters;
  
  const [filters, setFilters] = useState<TransactionFilters>(initialFilters);

  const { data: transactions = [], isLoading, error } = useTransactions();
  const { data: accounts = [] } = useAccounts();

  const accountCurrencyById = accounts.reduce(
    (map, account) => {
      map[account.id] = account.currency;
      return map;
    },
    {} as Record<string, Currency>,
  );

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    //Search filter
    if (filters.search.trim()) {
      const search = filters.search.toLowerCase();

      result = result.filter(transaction =>
        transaction.title.toLowerCase().includes(search) 
      );
    }

    //Type filter
    if (filters.type !== "All") {
      result = result.filter(transaction => transaction.type === filters.type);
    }

    //Sort filter
    result.sort((a, b) => {
      const left = new Date(a.date).getTime();
      const right = new Date(b.date).getTime();

      return filters.sortBy === "newest" ? right - left : left - right;
    });

    return result;
  }, [transactions, filters]);


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

  return (
    <div className={styles.transactionPage}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Transactions</h1>
          <p className={styles.subtitle}>Manage your transactions</p>
        </div>

        <Button onClick={() => setIsCreateOpen(true)}>+ New Transaction</Button>
      </div>

      <TransactionFilterBar
        filters={filters}
        onFiltersChange={setFilters}
      />

      {filteredTransactions.length === 0 ? (
        <EmptyState
          title="No Transactions"
          description="Create your first transaction to start tracking your finances."
          actionLabel="+ New Transaction"
          onActionClick={() => setIsCreateOpen(true)}
        />
      ) : (
        <TransactionList
          transactions={filteredTransactions}
          accountCurrencyById={accountCurrencyById}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

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
