import { Input } from "../../common/Input/Input";
import { Select } from "../../common/Select/Select";

import { AccountSelect } from "../../common/AccountSelect/AccountSelect";
import { CategorySelect } from "../../common/CategorySelect/CategorySelect";

import type { TransactionFilters } from "../../../types/transactionFilters";

import styles from "./TransactionFilterBar.module.scss";

interface TransactionFilterBarProps {
    filters: TransactionFilters;
    onFiltersChange: (filters: TransactionFilters) => void;
}

export function TransactionFilterBar({
    filters,
    onFiltersChange,
}: TransactionFilterBarProps) {
    const updateFilter = <K extends keyof TransactionFilters>(
        key: K,
        value: TransactionFilters[K],
    ) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    return (
        <div className={styles.filterBar}>
            <Input
                label="Search"
                placeholder="Search transactions"
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
            />
            <AccountSelect
                label="Account"
                value={filters.accountId ?? null}
                onChange={(value) => updateFilter("accountId", value ?? "")}
            />
            <CategorySelect
                label="Category"
                value={filters.categoryId ?? null}
                onChange={(value) => updateFilter("categoryId", value ?? "")}
            />

            <Select
                label="Type"
                value={filters.type}
                options={[
                    { value: "All", label: "All" },
                    { value: "Income", label: "Income" },
                    { value: "Expense", label: "Expense" },
                ]}
                onChange={(e) => updateFilter("type", e.target.value as TransactionFilters["type"])}
            />
        </div>
    );
}
