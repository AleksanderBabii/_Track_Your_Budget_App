import { Input } from "../../common/Input/Input";
import { Select } from "../../common/Select/Select";

import type { TransactionFilters } from "../../../types/transactionFilters";

import styles from "./TransactionFilterBar.module.scss";

interface TransactionFilterBarProps {
    filters: TransactionFilters;
    onFiltersChange: (filters: TransactionFilters) => void;
}

export function TransactionFilterBar({
    filters,
    onFiltersChange,
}: TransactionFilterBarProps    ) {
    return (
        <div className={styles.filterBar}>
            <Input
                label="Search"
                placeholder="Search transactions"
                value={filters.search}
                onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            />
            <Select
                label="Sort"
                value={filters.sortBy}
                options={[
                    { value: "newest", label: "Newest" },
                    { value: "oldest", label: "Oldest" },
                    { value: "highestAmount", label: "Highest Amount" },
                    { value: "lowestAmount", label: "Lowest Amount" },
                ]}
                onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value as TransactionFilters["sortBy"] })}
            />
        </div>
    );
}
