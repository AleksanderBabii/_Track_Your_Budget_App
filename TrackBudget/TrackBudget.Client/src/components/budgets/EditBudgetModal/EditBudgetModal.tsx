import { useUpdateBudget } from "../../../hooks/budgetHooks/useUpdateBudget";
import { useBudgetFormSubmission } from "../../../hooks/budgetHooks/useBudgetFormSubmission";
import type { Budget } from "../../../types/budget";
import type { BudgetFormValues } from "../../../utils/budgetSchema";
import { Modal } from "../../common/Modal/Modal";
import { BudgetForm } from "../BudgetForm/BudgetForm";

import styles from "./EditBudgetModal.module.scss";

interface EditBudgetModalProps {
  budget: Budget | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditBudgetModal({
  budget,
  isOpen,
  onClose,
}: EditBudgetModalProps) {
  const updateBudgetMutation = useUpdateBudget();
  const buildBudgetPayload = useBudgetFormSubmission();

  if (!budget) {
    return null;
  }

  const currentBudget = budget;

  async function handleSubmit(values: BudgetFormValues) {
    await updateBudgetMutation.mutateAsync({
      budgetId: currentBudget.id,
      request: buildBudgetPayload(values),
    });
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit budget">
      <div className={styles.content}>
        <BudgetForm
          defaultValues={{
            categoryId: currentBudget.categoryId,
            limit: currentBudget.limit,
          }}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="Update budget"
          isSubmitting={updateBudgetMutation.isPending}
        />
      </div>
    </Modal>
  );
}
