import { Fragment } from "react";

import { TransferCard } from "../TransferCard/TransferCard";

import { useTransferGroups } from "../../../hooks/transfersHooks/useTransferGroups";

import type { Currency } from "../../../types/account";
import type { Transfer } from "../../../types/transfer";

import styles from "./TransferList.module.scss";

interface TransferListProps {
  transfers: Transfer[];
  accountCurrencyById?: Record<string, Currency>;
}

export function TransferList({
  transfers,
  accountCurrencyById,
}: TransferListProps) {
  const { dates, groupedTransfers, formatDateLabel } =
    useTransferGroups(transfers);

  return (
    <div className={styles.transferList}>
      {dates.length === 0 && (
        <div className={styles.noTransfers}>
          <p>No transfers found.</p>
        </div>
      )}

      {dates.map((dateKey) => (
        <Fragment key={dateKey}>
          <h3 className={styles.dateHeader}>{formatDateLabel(dateKey)}</h3>

          <div className={styles.groupedTransfers}>
            {groupedTransfers[dateKey].map((transfer) => (
              <TransferCard
                key={transfer.accountId + transfer.date + transfer.amount}
                transfer={transfer}
                currency={
                  accountCurrencyById?.[transfer.fromAccountId] ?? "USD"
                }
              />
            ))}
          </div>
        </Fragment>
      ))}
    </div>
  );
}
