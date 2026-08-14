import { FiArrowUpCircle } from "react-icons/fi";
import clsx from "clsx";

import { Card } from "../../common/Card/Card";

import type { Currency } from "../../../types/account";
import type { Transfer } from "../../../types/transfer";

import styles from "./TransferCard.module.scss";

interface TransferCardProps {
  transfer: Transfer;
  currency?: Currency;
}

export function TransferCard({
  transfer,
  currency = "USD",
}: TransferCardProps) {
  const transferId = transfer.accountId;
  const transferLabel = `${transfer.fromAccountName} → ${transfer.toAccountName}`;
  const formattedAmount = `${transfer.amount} ${currency}`;
  const formattedDate = new Date(transfer.date).toLocaleDateString();

  return (
    <Card className={clsx(styles.transferCard, styles.transferCardDefault)}>
      <div className={styles.left}>
        <div className={styles.transferCardIcon}>
          <FiArrowUpCircle />
        </div>

        <div className={styles.transferCardInfo}>{transferId}</div>
        <div className={styles.transferCardAmount}>{formattedAmount}</div>

        <div className={styles.transferCardDetails}>
          <h3 className={styles.transferCardTitle}>{transferLabel}</h3>
          <p className={styles.transferCardDate}>{formattedDate}</p>
        </div>
      </div>
    </Card>
  );
}
