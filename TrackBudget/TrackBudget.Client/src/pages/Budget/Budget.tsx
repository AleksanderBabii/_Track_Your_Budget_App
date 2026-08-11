import { useState } from "react";
import { FiPlus } from "react-icons/fi";

import { useBudgets } from "../../hooks/budgetHooks/useBudgets";

import { CreateBudgetModal } from "../../components/budgets/CreateBudgetModal/CreateBudgetModal";
import { BudgetCard } from "../../components/budgets/BudgetCard/BudgetCard";

import { Button } from "../../components/common/Button/Button";
import { LoadingState } from "../../components/common/LoadingState/LoadingState";
import { ErrorState } from "../../components/common/ErrorState/ErrorState";
import { EmptyState } from "../../components/common/EmptyState/EmptyState";

import styles from "./Budget.module.scss";


export function BudgetPage() {
  const { data: budgets, isLoading, isError } = useBudgets();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (isLoading) {
    return <LoadingState message="Loading budgets..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load budgets."
        description="Please try again in a moment"
      />
    );
  }

  return (
    <div className={styles.budgetPage}>
      <header className={styles.header}>
        <h1>Budgets</h1>
        <Button type="button" onClick={() => setIsCreateModalOpen(true)}>
          <FiPlus aria-hidden="true" />
          Create Budget
        </Button>
      </header>

      {!budgets || budgets.length === 0 ? (
        <EmptyState
          title="No budgets found."
          description="Create your first budget to get started!"
        />
      ) : (
        budgets.map((budget) => (
          <BudgetCard
            key={budget.id}
            budget={budget}
            onEdit={() => {
              // Handle edit budget
            }}
            onDelete={() => {
              // Handle delete budget
            }}
          />
        ))
      )}

      <CreateBudgetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
