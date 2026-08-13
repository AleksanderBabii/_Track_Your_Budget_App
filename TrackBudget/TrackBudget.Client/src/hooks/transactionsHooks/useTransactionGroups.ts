import { useMemo } from "react";

import type { Transaction } from "../../types/transaction";
import { formatTransactionDate } from "../../utils/transactionDate";

export function useTransactionGroups(transactions: Transaction[]) {
  return useMemo(() => {
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    const groupedTransactions = sortedTransactions.reduce<Record<string, Transaction[]>>(
      (groups, transaction) => {
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
      {},
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

    return {
      dates,
      groupedTransactions,
      formatDateLabel: (dateKey: string) =>
        dateKey === "invalid-date" ? "Unknown date" : formatTransactionDate(dateKey),
    };
  }, [transactions]);
}
