import {FiCreditCard, FiTrash2} from 'react-icons/fi';   
 
import type {Account} from "../../../types/account"
import {Button} from "../../common/Button/Button";
import {Card} from "../../common/Card/Card";

import styles from './AccountCard.module.scss';

interface AccountCardProps {
    account: Account;
    onDelete: (accountId: Account) => void;
}

export function AccountCard({
    account,
    onDelete,
}: AccountCardProps) {
    // Format money and date for readable card output.
    const formattedBalance = new Intl.NumberFormat('en-US', {
        style: "currency",
        currency: account.currency,
    }).format(account.balance);

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(account.createdAt));

    return (
        <Card className={styles.accountCard}>
            <div className={styles.accountCardHeader}>
                <div className={styles.accountCardIcon}>
                    <FiCreditCard aria-hidden="true" />
                </div>

                <Button
                    type="button"
                    variant="secondary"
                    aria-label={`Delete account ${account.name}`}
                    // Parent component owns deletion side-effects.
                    onClick={() => onDelete(account)}
                >
                    <FiTrash2 aria-hidden="true" />
                </Button>
            </div>

            <div className={styles.accountCardBody}>
                <div>
                    <p className={styles.accountCardLabel}>Account</p>
                    <h2 className={styles.accountCardName}>{account.name}</h2>
                </div>

                <div>
                    <p className={styles.accountCardLabel}>Balance</p>
                    <p className={styles.accountCardBalance}>{formattedBalance}</p>
                </div>
            </div>

            <div className={styles.accountCardFooter}>
                <span>{account.currency}</span>
                <span>Created on {formattedDate}</span>
            </div>
        </Card>
    );
}
