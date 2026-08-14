import { useBudgets } from "../../../hooks/budgetHooks/useBudgets";
import type { Budget } from "../../../types/budget";
import { Spinner } from "../../common/Spinner/Spinner";
import { BudgetCard } from "../BudgetCard/BudgetCard";

import { LoadingState } from "../../common/LoadingState/LoadingState";
import { ErrorState } from "../../common/ErrorState/ErrorState";
import { EmptyState } from "../../common/EmptyState/EmptyState";

import styles from "./BudgetList.module.scss";

interface BudgetListProps {
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
  onCreate: () => void;
}

export function BudgetList({ onDelete, onCreate, onEdit }: BudgetListProps) {
  const { data: budgets = [], isLoading, isError, refetch } = useBudgets();

  if (isLoading) {
    return (
      <div className={styles.state}>
        <Spinner />
        <LoadingState message="Loading budgets..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.state}>
        <ErrorState
          title="Failed to load budgets."
          description="Something went wrong while loading your budgets. Please check your internet connection and try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <EmptyState
        title="No budgets found."
        description="You haven't created any budgets yet. Start by creating a new budget to manage your finances."
        actionLabel="Create Budget"
        onActionClick={onCreate}
      />
    );
  }

  return (
    <div className={styles.grid}>
      {budgets.map((budget) => (
        <BudgetCard
          key={budget.id}
          budget={budget}
          onEdit={() => onEdit(budget)}
          onDelete={() => onDelete(budget)}
        />
      ))}
    </div>
  );
}
