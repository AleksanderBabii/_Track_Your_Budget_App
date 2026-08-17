import { Button } from "../../components/common/Button/Button";
import { EmptyState } from "../../components/common/EmptyState/EmptyState";
import { ErrorState } from "../../components/common/ErrorState/ErrorState";
import { LoadingState } from "../../components/common/LoadingState/LoadingState";

import { CreateTransactionModal } from "../../components/transaction/CreateTransactionModal/CreateTransactionModal";
import { EditTransactionModal } from "../../components/transaction/EditTransactionModal/EditTransactionModal";
import { TransactionList } from "../../components/transaction/TransactionList/TransactionList";
import { DeleteTransactionDialog } from "../../components/transaction/DeleteTransactionDialog/DeleteTransactionDialog";
import { TransactionFilterBar } from "../../components/transaction/TransactionFilterBar/TransactionFilterBar";

import { useTransactionPageState } from "../../hooks/transactionsHooks/useTransactionPageState";

import styles from "./Transactions.module.scss";

export function Transactions() {
  const {
    isCreateOpen,
    isEditOpen,
    isDeleteOpen,
    transactionToEdit,
    filters,
    setFilters,
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
  } = useTransactionPageState();

  if (isLoading) {
    return <LoadingState message="Loading transactions..." />;
  }

  if (error) {
    return (
      <ErrorState
        message="Failed to load transactions."
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

        <Button onClick={openCreateModal}>+ New Transaction</Button>
      </div>

      <TransactionFilterBar filters={filters} onFiltersChange={setFilters} />

      {filteredTransactions.length === 0 ? (
        <EmptyState
          message="No Transactions"
          description="Create your first transaction to start tracking your finances."
          actionLabel="+ New Transaction"
          onActionClick={openCreateModal}
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
        onClose={closeCreateModal}
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
          onClose={closeDeleteDialog}
        />
      )}
    </div>
  );
}
