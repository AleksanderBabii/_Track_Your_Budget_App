import { FiCreditCard } from "react-icons/fi";

import { useAccounts } from "../../../hooks/accountHooks/useAccounts";
import type { Account } from "../../../types/account";
import { Button } from "../../common/Button/Button";
import { Spinner } from "../../common/Spinner/Spinner";
import { AccountCard } from "../AccountCard/AccountCard";

import styles from "./AccountList.module.scss";

interface AccountListProps {
    onEdit: (account: Account) => void;
    onDelete: (account: Account) => void;
    onCreate: () => void;
}

export function AccountList({ onDelete, onCreate, onEdit }: AccountListProps) {
    // Query handles loading/error/data lifecycle for account list.
    const {
        data: accounts = [],
        isLoading,
        isError,
        refetch,
    } = useAccounts();

    // Loading branch.
    if (isLoading) {
        return (
            <div className={styles.accountListState}>
                <Spinner />
                <p>Loading accounts....</p>
            </div>
        );
    }

    // Error branch with manual retry.
    if (isError) {
        return (
            <div className={styles.accountListState}>
                <h2>Failed to load accounts.</h2>

                <p>
                    Something went wrong while loading your accounts. Please check your internet connection and try again.
                </p>

                <Button type="button" onClick={() => refetch()}>
                    Retry
                </Button>
            </div>
        );
    }

    // Empty-state branch with CTA to open create modal.
    if (accounts.length === 0) {
        return (
            <div className={styles.accountListEmptyState}>
                <div className={styles.accountListEmptyStateIcon}>
                    <FiCreditCard aria-hidden="true" />
                </div>

                <h2>No accounts found</h2>

                <p>
                    You haven't added any accounts yet. Click the button below to create your first account.
                </p>

                <Button type="button" onClick={onCreate}>
                    Create Account
                </Button>
            </div>
        );
    }

    // Success branch: render account cards grid.
    return (
        <div className={styles.accountListGrid}>
            {accounts.map((account) => (
                <AccountCard
                    key={account.id}
                    account={account}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
}