import { Fragment } from "react";

import { TransactionCard } from "../TransactionCard/TransactionCard";

import { useTransactionGroups } from "../../../hooks/transactionHooks/useTransactionGroups";

import type { Currency } from "../../../types/account";
import type { Transaction } from "../../../types/transaction";

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
  const { dates, groupedTransactions, formatDateLabel } = useTransactionGroups(transactions);

  return (
    <div className={styles.transactionList}>
      {dates.length === 0 && (
        <div className={styles.noTransactions}>
          <p>No transactions found.</p>
        </div>
      )}

      {dates.map((dateKey) => (
        <Fragment key={dateKey}>
          <h3 className={styles.dateHeader}>{formatDateLabel(dateKey)}</h3>

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


