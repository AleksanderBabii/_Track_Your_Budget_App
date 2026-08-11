import { useCreateCategory } from "../../../hooks/categoryHooks/useCreateCategory";
import { useCategoryFormSubmission } from "../../../hooks/categoryHooks/useCategoryFormSubmission";

import type { CategoryFormValues } from "../../../utils/categorySchema";

import { Modal } from "../../common/Modal/Modal";
import { CategoryForm } from "../CategoryForm/CategoryForm";

import styles from "./CreateCategoryModal.module.scss";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCategoryModal({ isOpen, onClose }: CreateCategoryModalProps) {
  const createCategoryMutation = useCreateCategory();
  const buildCategoryPayload = useCategoryFormSubmission();

  async function handleSubmit(values: CategoryFormValues): Promise<void> {
    await createCategoryMutation.mutateAsync(buildCategoryPayload(values));
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create category">
      <div className={styles.content}>
        <p className={styles.description}>
          Categories help organize your income and expenses.
        </p>

        <CategoryForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={createCategoryMutation.isPending}
          submitLabel="Create category"
        />
      </div>
    </Modal>
  );
}
