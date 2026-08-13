import {
  FiArrowUpCircle,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import clsx from "clsx";

import { Button } from "../../common/Button/Button";
import { Card } from "../../common/Card/Card";

import type { Currency } from "../../../types/account";
import type { Transfer } from "../../../types/transfer";

import styles from "./TransferCard.module.scss";

interface TransferCardProps {
  transfer: Transfer;
  currency?: Currency;
  onEdit: (transfer: Transfer) => void;
  onDelete: (transferId: string) => void;
}

export function TransferCard({
  transfer,
  currency = "USD",
    onEdit,
    onDelete,
}: TransferCardProps) {
    const transferId = transfer.id;
    const transferLabel = `${transfer.fromAccountName} → ${transfer.toAccountName}`;
    const formattedAmount = `${transfer.amount} ${currency}`;
    const formattedDate = new Date(transfer.date).toLocaleDateString();

    return (
        <Card 
            className={clsx(styles.transferCard,
                styles.transferCardDefault
            )}
        >
            <div className={styles.left}>
                <div className={styles.transferCardIcon}>
                    <FiArrowUpCircle />
                </div>

                <div className={styles.transferCardDetails}>
                    <h3 className={styles.transferCardTitle}>{transferLabel}</h3>
                    <p className={styles.transferCardDate}>{formattedDate}</p>
                </div>
            </div>

            <div className={styles.right}>
                <p className={styles.transferCardAmount}>{formattedAmount}</p>
                <div className={styles.transferCardActions}>
                    <Button
                        className={styles.transferCardEditButton}
                        onClick={() => onEdit(transfer)}
                    >
                        <FiEdit2 />
                    </Button>
                    <Button
                        className={styles.transferCardDeleteButton}
                        onClick={() => onDelete(transferId)}
                    >
                        <FiTrash2 />
                    </Button>
                </div>
            </div>
        </Card>
    );
}