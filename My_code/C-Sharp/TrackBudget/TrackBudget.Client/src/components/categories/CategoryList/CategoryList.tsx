import { FiFolder } from "react-icons/fi";

import { useCategories } from "../../../hooks/categoryHooks/useCategories";
import type { Category } from "../../../types/category";
import { Button } from "../../common/Button/Button";
import { Spinner } from "../../common/Spinner/Spinner";
import { CategoryCard } from "../CategoryCard/CategoryCard";

import styles from "./CategoryList.module.scss";

interface CategoryListProps {
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onCreate: () => void;
}

export function CategoryList({ onDelete, onCreate, onEdit }: CategoryListProps) {
  const { data: categories = [], isLoading, isError, refetch } = useCategories();

  if (isLoading) {
    return (
      <div className={styles.state}>
        <Spinner />
        <p>Loading categories...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.state}>
        <h2>Failed to load categories.</h2>
        <p>Something went wrong while loading your categories. Please check your internet connection and try again.</p>
        <Button type="button" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <FiFolder aria-hidden="true" />
        </div>
        <h2>No categories yet</h2>
        <p>You haven't added any categories yet. Click the button below to create your first category.</p>
        <Button type="button" onClick={onCreate}>
          Create Category
        </Button>
      </div>
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
