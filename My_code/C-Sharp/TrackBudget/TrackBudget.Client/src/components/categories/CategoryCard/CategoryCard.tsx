import { FiEdit2, FiTag, FiTrash2 } from "react-icons/fi";

import type { Category } from "../../../types/category";
import { Button } from "../../common/Button/Button";
import { Card } from "../../common/Card/Card";

import styles from "./CategoryCard.module.scss";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div className={styles.icon}>
          <FiTag aria-hidden="true" />
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="ghost" onClick={() => onEdit(category)}>
            <FiEdit2 aria-hidden="true" />
          </Button>

          <Button type="button" variant="danger" onClick={() => onDelete(category)}>
            <FiTrash2 aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{category.name}</h3>
        <span className={category.type === "Income" ? styles.income : styles.expense}>
          {category.type}
        </span>
      </div>
    </Card>
  );
}
