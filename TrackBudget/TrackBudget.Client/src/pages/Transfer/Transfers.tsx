import { Button } from "../../components/common/Button/Button";
import { Card } from "../../components/common/Card/Card";

import { LoadingState } from "../../components/common/LoadingState/LoadingState";
import { ErrorState } from "../../components/common/ErrorState/ErrorState";
import { EmptyState } from "../../components/common/EmptyState/EmptyState";

import { useTransfers } from "../../hooks/transfersHooks/useTransfers";

import styles from "./Transfers.module.scss";

export const Transfers = () => {
  const { transfers, isLoading, error } = useTransfers();

    if (isLoading) {
        return <LoadingState message="Loading transfers..." />;
    }
    if (error) {
        return <ErrorState title="Failed to load transfers." />;
    }
    if (transfers.length === 0) {
        return <EmptyState title="No transfers found." description="You have not made any transfers yet." />;
    }
    }

    return (
        <div className={styles.transfersPage}>
            <div className={styles.header}>
                <h1>Transfers</h1>
                <p>Here you can view all your transfers.</p>
            </div>

            < Button onClick={() => { /* Handle new transfer */ }}>+ New Transfer</Button>
        </div>

        <TransferFilterBar filters={filters} onFiltersChange={setFilters} />

        {filteredTransfers.length === 0 ? (
            <EmptyState
                title="No transfers found."
                description="You have not made any transfers yet."
                actionLabel="Create Transfer"
                onActionClick={() => { /* Handle new transfer */ }}
            />
        ) : (
            <TransfersList
                transfers={filteredTransfers}
                accountCurrencyById={accountCurrencyById}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        )}

        <CreateTransferModal
            isOpen={isCreateOpen}
            onClose={closeCreateModal}
        />

        <EditTransferModal
            isOpen={isEditOpen}
            transfers={transferToEdit}
            onClose={handleCloseEditModal}
        />

        {isDeleteOpen && (
            <DeleteTransferDialog
                transfer={transferToDelete}
                isOpen={isDeleteOpen}
                onClose={handleCloseDeleteModal}
            />
        )}
        </div>
    );
}
