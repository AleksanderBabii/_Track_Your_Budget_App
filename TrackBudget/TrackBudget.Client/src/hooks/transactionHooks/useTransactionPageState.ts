import { useMemo, useState } from "react";

import { useAccounts } from "../accountHooks/useAccounts";
import { useTransactions } from "./useTransactions";

import type { Currency } from "../../types/account";
import type { Transaction } from "../../types/transaction";
import type { TransactionFilters } from "../../types/transactionFilters";

const initialFilters: TransactionFilters = {
  search: "",
  accountId: null,
  categoryId: null,
  type: "All",
  sortBy: "newest",
  startDate: null,
  endDate: null,
};

export function useTransactionPageState() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>(initialFilters);

  const { data: transactions = [], isLoading, error } = useTransactions();
  const { data: accounts = [] } = useAccounts();

  const accountCurrencyById = useMemo(
    () =>
      accounts.reduce<Record<string, Currency>>((map, account) => {
        map[account.id] = account.currency;
        return map;
      }, {}),
    [accounts],
  );

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (filters.search.trim()) {
      const search = filters.search.toLowerCase();

      result = result.filter((transaction) => {
        const searchableText = [
          transaction.title,
          transaction.categoryId,
          transaction.accountId,
          transaction.accountName,
          transaction.amount.toString(),
          transaction.date,
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(search);
      });
    }

    if (filters.accountId) {
      result = result.filter((transaction) => transaction.accountId === filters.accountId);
    }

    if (filters.categoryId) {
      result = result.filter((transaction) => transaction.categoryId === filters.categoryId);
    }

    if (filters.type !== "All") {
      result = result.filter((transaction) => transaction.type === filters.type);
    }

    result.sort((a, b) => {
      const first = new Date(a.date).getTime();
      const second = new Date(b.date).getTime();

      return filters.sortBy === "newest" ? second - first : first - second;
    });

    return result;
  }, [filters, transactions]);

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

  const openCreateModal = () => setIsCreateOpen(true);
  const closeCreateModal = () => setIsCreateOpen(false);
  const closeDeleteDialog = () => setIsDeleteOpen(false);

  return {
    isCreateOpen,
    isEditOpen,
    isDeleteOpen,
    transactionToEdit,
    filters,
    setFilters,
    transactions,
    filteredTransactions,
    accountCurrencyById,
    isLoading,
    error,
    handleEdit,
    handleCloseEditModal,
    handleDelete,
    openCreateModal,
    closeCreateModal,
    closeDeleteDialog,
  };
}
