import { useState } from "react";
import { FiPlus } from "react-icons/fi";

import { useDeleteBudget } from "../../hooks/budgetHooks/useDeleteBudget";

import { CreateBudgetModal } from "../../components/budgets/CreateBudgetModal/CreateBudgetModal";
import { EditBudgetModal } from "../../components/budgets/EditBudgetModal/EditBudgetModal";
import { BudgetList } from "../../components/budgets/BudgetList/BudgetList";

import { Button } from "../../components/common/Button/Button";
import { ConfirmDialog } from "../../components/common/ConfirmDialog/ConfirmDialog";

import { PageContainer } from "../../components/layout/PageContainer/PageContainer";

import type { Budget } from "../../types/budget";

import styles from "./Budget.module.scss";

export function BudgetPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState<Budget | null>(null);
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);
  const deleteBudgetMutation = useDeleteBudget();

  function handleEditBudget(budget: Budget) {
    setBudgetToDelete(null);
    setBudgetToEdit(budget);
    setIsEditModalOpen(true);
  }

  function handleDeleteBudget(budget: Budget) {
    setBudgetToEdit(null);
    setIsEditModalOpen(false);
    setBudgetToDelete(budget);
  }

  function handleConfirmDelete() {
    if (budgetToDelete) {
      deleteBudgetMutation.mutate(budgetToDelete.id);
      setBudgetToDelete(null);
    }
  }

  function handleCancelDelete() {
    setBudgetToDelete(null);
  }

  return (
    <PageContainer>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Budgets</h1>
            <p className={styles.description}>
              Manage your budgets and track your spending.
            </p>
          </div>

          <Button type="button" onClick={() => setIsCreateModalOpen(true)}>
            <FiPlus aria-hidden="true" />
            New budget
          </Button>
        </div>

        <BudgetList
          onCreate={() => setIsCreateModalOpen(true)}
          onEdit={handleEditBudget}
          onDelete={handleDeleteBudget}
        />
        
        <CreateBudgetModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />

        <EditBudgetModal
          isOpen={isEditModalOpen}
          budget={budgetToEdit}
          onClose={() => {
            setIsEditModalOpen(false);
            setBudgetToEdit(null);
          }}
        />

        <ConfirmDialog
          isOpen={!!budgetToDelete}
          title="Confirm Delete"
          message="Are you sure you want to delete this budget?"
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deleteBudgetMutation.isPending}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </PageContainer>
  );
}