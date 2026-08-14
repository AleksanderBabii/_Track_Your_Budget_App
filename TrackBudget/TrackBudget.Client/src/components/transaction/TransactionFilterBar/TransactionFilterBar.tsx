import clsx from "clsx";
import { Input } from "../../common/Input/Input";
import { Select } from "../../common/Select/Select";
import { Button } from "../../common/Button/Button";

import { AccountSelect } from "../../common/AccountSelect/AccountSelect";
import { CategorySelect } from "../../common/CategorySelect/CategorySelect";

import type { TransactionFilters } from "../../../types/transactionFilters";

import styles from "./TransactionFilterBar.module.scss";

interface TransactionFilterBarProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
}

const defaultFilters: TransactionFilters = {
  search: "",
  accountId: null,
  categoryId: null,
  type: "All",
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

  const hasActiveFilters =
    filters.search.trim().length > 0 ||
    Boolean(filters.accountId) ||
    Boolean(filters.categoryId) ||
    filters.type !== "All" ||
    filters.sortBy !== "newest" ||
    Boolean(filters.startDate) ||
    Boolean(filters.endDate);

  const { startDate: monthStart, endDate: monthEnd } = getCurrentMonthRange();

  const isThisMonthActive =
    Boolean(filters.startDate) &&
    Boolean(filters.endDate) &&
    new Date(filters.startDate!).toDateString() === monthStart.toDateString() &&
    new Date(filters.endDate!).toDateString() === monthEnd.toDateString();

  const applyTypeQuickFilter = (type: TransactionFilters["type"]) => {
    onFiltersChange({ ...filters, type });
  };

  const applyThisMonthFilter = () => {
    onFiltersChange({
      ...filters,
      startDate: monthStart,
      endDate: monthEnd,
    });
  };

  return (
    <div className={styles.filterBar}>
      <div className={styles.quickFilters}>
        <Button
          type="button"
          size="small"
          variant="ghost"
          className={clsx(
            styles.quickFilterButton,
            filters.type === "Income" && styles.quickFilterButtonActive,
          )}
          onClick={() => applyTypeQuickFilter("Income")}
        >
          Income
        </Button>

        <Button
          type="button"
          size="small"
          variant="ghost"
          className={clsx(
            styles.quickFilterButton,
            filters.type === "Expense" && styles.quickFilterButtonActive,
          )}
          onClick={() => applyTypeQuickFilter("Expense")}
        >
          Expense
        </Button>

        <Button
          type="button"
          size="small"
          variant="ghost"
          className={clsx(
            styles.quickFilterButton,
            isThisMonthActive && styles.quickFilterButtonActive,
          )}
          onClick={applyThisMonthFilter}
        >
          This month
        </Button>
      </div>

      <div className={styles.fields}>
        <div className={styles.searchField}>
          <Input
            label="Search"
            placeholder="Search transactions"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
          />
        </div>

        <div className={styles.accountField}>
          <AccountSelect
            label="Account"
            value={filters.accountId ?? null}
            onChange={(value) => updateFilter("accountId", value ?? "")}
          />
        </div>

        <div className={styles.categoryField}>
          <CategorySelect
            label="Category"
            value={filters.categoryId ?? null}
            onChange={(value) => updateFilter("categoryId", value ?? "")}
          />
        </div>

        <div className={styles.typeField}>
          <Select
            label="Type"
            value={filters.type}
            options={[
              { value: "All", label: "All" },
              { value: "Income", label: "Income" },
              { value: "Expense", label: "Expense" },
            ]}
            onChange={(e) =>
              updateFilter("type", e.target.value as TransactionFilters["type"])
            }
          />
        </div>

        <div className={styles.sortField}>
          <Select
            label="Sort"
            value={filters.sortBy}
            options={[
              { value: "newest", label: "Newest" },
              { value: "oldest", label: "Oldest" },
              { value: "highestAmount", label: "Highest amount" },
              { value: "lowestAmount", label: "Lowest amount" },
            ]}
            onChange={(e) =>
              updateFilter(
                "sortBy",
                e.target.value as TransactionFilters["sortBy"],
              )
            }
          />
        </div>

        <div className={styles.fromField}>
          <Input
            label="From"
            type="date"
            value={formatDateInputValue(filters.startDate)}
            onChange={(e) =>
              updateFilter("startDate", parseDateInputValue(e.target.value))
            }
          />
        </div>

        <div className={styles.toField}>
          <Input
            label="To"
            type="date"
            value={formatDateInputValue(filters.endDate)}
            onChange={(e) =>
              updateFilter("endDate", parseDateInputValue(e.target.value))
            }
          />
        </div>

        <div className={styles.actions}>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onFiltersChange(defaultFilters)}
            disabled={!hasActiveFilters}
          >
            Reset filters
          </Button>
        </div>
      </div>
    </div>
  );
}
