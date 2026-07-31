import { Fragment } from "react";

import { TransactionCard } from "../TransactionCard/TransactionCard";

import type { Currency } from "../../../types/account";
import type { Transaction } from "../../../types/transaction";
import { formatTransactionDate } from "../../../utils/date";

import styles from "./TransactionList.module.scss";

interface TransactionListProps {
  transactions: Transaction[];
  accountCurrencyById?: Record<string, Currency>;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
}

export function TransactionList({
  transactions,
  accountCurrencyById,
  onEdit,
  onDelete,
}: TransactionListProps) {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const groupedTransactions = sortedTransactions.reduce(
    (groups: Record<string, Transaction[]>, transaction) => {
      const parsedDate = new Date(transaction.date);
      const isValidDate = !Number.isNaN(parsedDate.getTime());
      const dateKey = isValidDate
        ? parsedDate.toISOString().slice(0, 10)
        : "invalid-date";

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].push(transaction);
      return groups;
    },
    {} as Record<string, Transaction[]>,
  );

  const dates = Object.keys(groupedTransactions).sort((a, b) => {
    if (a === "invalid-date") {
      return 1;
    }

    if (b === "invalid-date") {
      return -1;
    }

    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <div className={styles.transactionList}>
      {dates.length === 0 && (
        <div className={styles.noTransactions}>
          <p>No transactions found.</p>
        </div>
      )}

      {dates.map((dateKey) => (
        <Fragment key={dateKey}>
          <h3 className={styles.dateHeader}>
            {dateKey === "invalid-date"
              ? "Unknown date"
              : formatTransactionDate(dateKey)}
          </h3>

          <div className={styles.groupedTransactions}>
            {groupedTransactions[dateKey].map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                currency={accountCurrencyById?.[transaction.accountId]}
                onEdit={() => onEdit(transaction)}
                onDelete={() => onDelete(transaction.id)}
              />
            ))}
          </div>
        </Fragment>
      ))}
    </div>
  );
}


