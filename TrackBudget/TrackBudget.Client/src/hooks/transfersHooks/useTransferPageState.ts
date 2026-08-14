import { useMemo, useState } from "react";

import { useAccounts } from "../accountsHooks/useAccounts";
import { useTransfers } from "./useTransfers";

import type { Currency } from "../../types/account";
import type { TransferFilters } from "../../types/transferFilters";

const initialFilters: TransferFilters = {
  search: "",
  fromAccountId: null,
    toAccountId: null,
    sortBy: "newest",
    startDate: null,
    endDate: null,
};

export function useTransferPageState() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filters, setFilters] = useState<TransferFilters>(initialFilters);

    const { data: transfers = [], isLoading, error } = useTransfers();
    const { data: accounts = [] } = useAccounts();

    const accountCurrencyById = useMemo(
        () =>
            accounts.reduce<Record<string, Currency>>((map, account) => {
                map[account.id] = account.currency;
                return map;
            }, {}),
        [accounts],
    );

    const filteredTransfers = useMemo(() => {
        let result = [...transfers];

        if (filters.search.trim()) {
            const search = filters.search.toLowerCase();

            result = result.filter((transfer) => {
                const searchableText = [
                    transfer.accountId,
                    transfer.fromAccountName,
                    transfer.toAccountName,
                    transfer.amount.toString(),
                    transfer.date,
                ]
                    .join(" ")
                    .toLowerCase();
                return searchableText.includes(search);
            });
        }
        if (filters.fromAccountId) {
            result = result.filter((transfer) => transfer.fromAccountId === filters.fromAccountId);
        }
        if (filters.toAccountId) {
            result = result.filter((transfer) => transfer.toAccountId === filters.toAccountId);
        }
        if (filters.startDate) {
            result = result.filter((transfer) => new Date(transfer.date) >= new Date(filters.startDate!));
        }
        if (filters.endDate) {
            result = result.filter((transfer) => new Date(transfer.date) <= new Date(filters.endDate!));
        }
        if (filters.sortBy === "newest") {
            result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        if (filters.sortBy === "oldest") {
            result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        }
        
        result.sort((a, b) => {
            switch (filters.sortBy) {
                case "newest":
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                case "oldest":
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                case "highestAmount":
                    return b.amount - a.amount;
                case "lowestAmount":
                    return a.amount - b.amount;
                default:
                    return 0;
            }
        });
        return result;
    }, [transfers, filters]);

    const openCreateModal = () => setIsCreateOpen(true);
    const closeCreateModal = () => setIsCreateOpen(false);

    return {
        isCreateOpen,
        filters,
        setFilters,
        filteredTransfers,
        accountCurrencyById,
        isLoading,
        error,
        openCreateModal,
        closeCreateModal,
    };
}