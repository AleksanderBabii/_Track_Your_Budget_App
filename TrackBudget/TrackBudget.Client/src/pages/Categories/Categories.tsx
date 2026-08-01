import { useState } from "react";
import { FiPlus } from "react-icons/fi";

import { Button } from "../../components/common/Button/Button";
import { ConfirmDialog } from "../../components/common/ConfirmDialog/ConfirmDialog";
import { CreateCategoryModal } from "../../components/categories/CreateCategoryModal/CreateCategoryModal";
import { EditCategoryModal } from "../../components/categories/EditCategoryModal/EditCategoryModal";
import { CategoryList } from "../../components/categories/CategoryList/CategoryList";
import { PageContainer } from "../../components/layout/PageContainer/PageContainer";
import { useDeleteCategory } from "../../hooks/categoryHooks/useDeleteCategory";
import type { Category } from "../../types/category";

import styles from "./Categories.module.scss";

export function Categories() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const deleteCategoryMutation = useDeleteCategory();

  function handleEditCategory(category: Category) {
    setCategoryToDelete(null);
    setCategoryToEdit(category);
    setIsEditModalOpen(true);
  }

  function handleDeleteCategory(category: Category) {
    setCategoryToEdit(null);
    setIsEditModalOpen(false);
    setCategoryToDelete(category);
  }

  async function handleConfirmDelete() {
    if (categoryToDelete) {
      await deleteCategoryMutation.mutateAsync(categoryToDelete.id);
      setCategoryToDelete(null);
    }
  }

  function handleCancelDelete() {
    setCategoryToDelete(null);
  }

  return (
    <PageContainer>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Categories</h1>
            <p className={styles.description}>Organize your income and expenses.</p>
          </div>

          <Button type="button" onClick={() => setIsCreateModalOpen(true)}>
            <FiPlus aria-hidden="true" />
            New category
          </Button>
        </div>

        <CategoryList
          onCreate={() => setIsCreateModalOpen(true)}
          onDelete={handleDeleteCategory}
          onEdit={handleEditCategory}
        />

        <CreateCategoryModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />

        <EditCategoryModal
          isOpen={isEditModalOpen}
          category={categoryToEdit}
          onClose={() => {
            setIsEditModalOpen(false);
            setCategoryToEdit(null);
          }}
        />

        <ConfirmDialog
          isOpen={categoryToDelete !== null}
          title="Delete Category"
          message={`Are you sure you want to delete the category "${categoryToDelete?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deleteCategoryMutation.isPending}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </PageContainer>
  );
}
