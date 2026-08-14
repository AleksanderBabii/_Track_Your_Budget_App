import { Button } from "../../components/common/Button/Button";
import { LoadingState } from "../../components/common/LoadingState/LoadingState";
import { ErrorState } from "../../components/common/ErrorState/ErrorState";
import { EmptyState } from "../../components/common/EmptyState/EmptyState";

import { TransferFilterBar } from "../../components/transfers/TransferFilterBar/TransferFilterBar";
import { TransferList } from "../../components/transfers/TransferList/TransferList";
import { CreateTransferModal } from "../../components/transfers/CreateTransferModal/CreateTransferModal";

import { useTransferPageState } from "../../hooks/transfersHooks/useTransferPageState";

import styles from "./Transfers.module.scss";

export const Transfers = () => {
  const {
    isCreateOpen,
    filters,
    setFilters,
    filteredTransfers,
    accountCurrencyById,
    isLoading,
    error,
    openCreateModal,
    closeCreateModal,
  } = useTransferPageState();

  if (isLoading) {
    return <LoadingState message="Loading transfers..." />;
  }
  if (error) {
    return <ErrorState title="Failed to load transfers." />;
  }
  if (filteredTransfers.length === 0) {
    return (
      <EmptyState
        title="No transfers found."
        description="You have not made any transfers yet."
      />
    );
  }

  return (
    <div className={styles.transferPage}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Transfers</h1>
          <p className={styles.subtitle}>Manage your transfers</p>
        </div>

        <Button onClick={openCreateModal}>+ New Transfer</Button>
      </div>

      <TransferFilterBar filters={filters} onFiltersChange={setFilters} />

      {filteredTransfers.length === 0 ? (
        <EmptyState
          title="No transfers found."
          description="You have not made any transfers yet."
        />
      ) : (
        <TransferList
          transfers={filteredTransfers}
          accountCurrencyById={accountCurrencyById}
        />
      )}
      <CreateTransferModal isOpen={isCreateOpen} onClose={closeCreateModal} />
    </div>
  );
};
