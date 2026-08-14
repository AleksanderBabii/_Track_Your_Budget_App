import { useUpdateCategory } from "../../../hooks/categoriesHooks/useUpdateCategory";
import { useCategoryFormSubmission } from "../../../hooks/categoriesHooks/useCategoryFormSubmission";
import type { Category } from "../../../types/category";
import type { CategoryFormValues } from "../../../utils/categorySchema";
import { Modal } from "../../common/Modal/Modal";
import { CategoryForm } from "../CategoryForm/CategoryForm";

import styles from "./EditCategoryModal.module.scss";

interface EditCategoryModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditCategoryModal({
  category,
  isOpen,
  onClose,
}: EditCategoryModalProps) {
  const updateCategoryMutation = useUpdateCategory();
  const buildCategoryPayload = useCategoryFormSubmission();

  if (!category) {
    return null;
  }

  const currentCategory = category;

  async function handleSubmit(values: CategoryFormValues) {
    await updateCategoryMutation.mutateAsync({
      categoryId: currentCategory.id,
      request: buildCategoryPayload(values),
    });

    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit category">
      <div className={styles.content}>
        <CategoryForm
          defaultValues={{
            name: currentCategory.name,
            type: currentCategory.type,
          }}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="Update category"
          isSubmitting={updateCategoryMutation.isPending}
        />
      </div>
    </Modal>
  );
}
