import { Input } from "../../common/Input/Input";
import { Select } from "../../common/Select/Select";
import { Button } from "../../common/Button/Button";

import { AccountSelect } from "../../common/AccountSelect/AccountSelect";
import type { TransferFilters } from "../../../types/transferFilters";

import styles from "./TransferFilterBar.module.scss";

interface TransferFilterBarProps {
  filters: TransferFilters;
  onFiltersChange: (filters: TransferFilters) => void;
}

const defaultFilters: TransferFilters = {
  search: "",
  fromAccountId: null,
  toAccountId: null,
  sortBy: "newest",
  startDate: null,
  endDate: null,
};

function formatDateInputValue(date: Date | null): string {
  if (!date) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDateInputValue(value: string): Date | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00`);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getCurrentMonthRange(): { startDate: Date; endDate: Date } {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return { startDate, endDate };
}

export function TransferFilterBar({
  filters,
  onFiltersChange,
}: TransferFilterBarProps) {
  const updatedFilters = <T extends keyof TransferFilters>(
    key: T,
    value: TransferFilters[T],
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters =
    filters.search.trim().length > 0 ||
    Boolean(filters.fromAccountId) ||
    Boolean(filters.toAccountId) ||
    filters.sortBy !== "newest" ||
    Boolean(filters.startDate) ||
    Boolean(filters.endDate);

  const { startDate: monthStartDate, endDate: monthEndDate } =
    getCurrentMonthRange();

  const isThisMonthActive =
    Boolean(filters.startDate) && Boolean(filters.endDate);

  const applyThisMonthFilter = () => {
    onFiltersChange({
      ...filters,
      startDate: monthStartDate,
      endDate: monthEndDate,
    });
  };

  const handleResetFilters = () => {
    onFiltersChange(defaultFilters);
  };

  return (
    <div className={styles.filterBar}>
      <div className={styles.filterRow}>
        <Input
          label="Search"
          value={filters.search}
          onChange={(e) => updatedFilters("search", e.target.value)}
          placeholder="Search transfers..."
        />
        <AccountSelect
          label="From Account"
          value={filters.fromAccountId}
          onChange={(value) => updatedFilters("fromAccountId", value)}
        />
        <AccountSelect
          label="To Account"
          value={filters.toAccountId}
          onChange={(value) => updatedFilters("toAccountId", value)}
        />

        <Select
          label="Sort By"
          value={filters.sortBy}
          options={[
            { value: "newest", label: "Newest" },
            { value: "oldest", label: "Oldest" },
            { value: "highestAmount", label: "Highest Amount" },
            { value: "lowestAmount", label: "Lowest Amount" },
          ]}
          onChange={(e) =>
            updatedFilters(
              "sortBy",
              e.target.value as TransferFilters["sortBy"],
            )
          }
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="highestAmount">Highest Amount</option>
          <option value="lowestAmount">Lowest Amount</option>
        </Select>

        <Input
          label="Start Date"
          type="date"
          value={formatDateInputValue(filters.startDate)}
          onChange={(e) =>
            updatedFilters("startDate", parseDateInputValue(e.target.value))
          }
        />

        <Input
          label="End Date"
          type="date"
          value={formatDateInputValue(filters.endDate)}
          onChange={(e) =>
            updatedFilters("endDate", parseDateInputValue(e.target.value))
          }
        />
      </div>

      <div className={styles.filterActions}>
        <Button
          variant="secondary"
          onClick={applyThisMonthFilter}
          disabled={isThisMonthActive}
        >
          This Month
        </Button>
        <Button
          variant="secondary"
          onClick={handleResetFilters}
          disabled={!hasActiveFilters}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
