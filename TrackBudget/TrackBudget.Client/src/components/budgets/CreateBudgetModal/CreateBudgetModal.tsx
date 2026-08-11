import { useCreateBudget } from "../../../hooks/budgetHooks/useCreateBudget";
import { useBudgetFormSubmission } from "../../../hooks/budgetHooks/useBudgetFormSubmission";

import type { BudgetFormValues } from "../../../utils/budgetSchema";

import { Modal } from "../../common/Modal/Modal";
import { BudgetForm } from "../BudgetForm/BudgetForm";

import styles from "./CreateBudgetModal.module.scss";

interface CreateBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateBudgetModal({ isOpen, onClose }: CreateBudgetModalProps) {
  const createBudgetMutation = useCreateBudget();
  const buildBudgetPayload = useBudgetFormSubmission();

  async function handleSubmit(values: BudgetFormValues): Promise<void> {
    await createBudgetMutation.mutateAsync(buildBudgetPayload(values));
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create budget">
      <div className={styles.content}>
        <p className={styles.description}>
          Set a spending limit for a category and period.
        </p>

        <BudgetForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={createBudgetMutation.isPending}
          submitLabel="Create budget"
        />
      </div>
    </Modal>
  );
}
