import { useMemo } from "react";

import type { Transfer } from "../../types/transfer";
import { formatTransferDate } from "../../utils/transferDate";

export function useTransferGroups(transfers: Transfer[]) {
  return useMemo(() => {
    const sortedTransfers = [...transfers].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    const groupedTransfers = sortedTransfers.reduce<Record<string, Transfer[]>>(
      (groups, transfer) => {
        const parsedDate = new Date(transfer.date);
        const isValidDate = !Number.isNaN(parsedDate.getTime());
        const dateKey = isValidDate
          ? parsedDate.toISOString().slice(0, 10)
          : "invalid-date";

        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }

        groups[dateKey].push(transfer);
        return groups;
      },
      {},
    );

    const dates = Object.keys(groupedTransfers).sort((a, b) => {
      if (a === "invalid-date") {
        return 1;
      }

      if (b === "invalid-date") {
        return -1;
      }

      return new Date(b).getTime() - new Date(a).getTime();
    });

    return {
      groupedTransfers,
      dates,
      formatDateLabel: (dateKey: string) =>
        dateKey === "invalid-date"
          ? "Unknown date"
          : formatTransferDate(dateKey),
    };
  }, [transfers]);
}
