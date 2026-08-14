import { useCategories } from "../../../hooks/categoriesHooks/useCategories";
import type { Category } from "../../../types/category";
import { Spinner } from "../../common/Spinner/Spinner";
import { CategoryCard } from "../CategoryCard/CategoryCard";

import { LoadingState } from "../../common/LoadingState/LoadingState";
import { ErrorState } from "../../common/ErrorState/ErrorState";
import { EmptyState } from "../../common/EmptyState/EmptyState";

import styles from "./CategoryList.module.scss";

interface CategoryListProps {
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onCreate: () => void;
}

export function CategoryList({
  onDelete,
  onCreate,
  onEdit,
}: CategoryListProps) {
  const {
    data: categories = [],
    isLoading,
    isError,
    refetch,
  } = useCategories();

  if (isLoading) {
    return (
      <div className={styles.state}>
        <Spinner />
        <LoadingState message="Loading categories..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.state}>
        <ErrorState
          title="Failed to load categories."
          description="Something went wrong while loading your categories. Please check your internet connection and try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <EmptyState
        title="No categories found."
        description="You haven't created any categories yet. Start by creating a new category to organize your budgets."
        actionLabel="Create Category"
        onActionClick={onCreate}
      />
    );
  }

  return (
    <div className={styles.grid}>
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
