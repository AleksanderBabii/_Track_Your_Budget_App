import clsx from "clsx";
import { FiEdit2, FiTarget, FiTrash2 } from "react-icons/fi";

import type { Budget } from "../../../types/budget";
import { formatCurrency } from "../../../utils/formatCurrency";
import { Button } from "../../common/Button/Button";
import { Card } from "../../common/Card/Card";

import { MONTH_NAMES } from "../../../utils/budgetSchema";

import styles from "./BudgetCard.module.scss";

interface BudgetCardProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
}

export function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const percentage = budget.limit > 0
    ? Math.min((budget.spent / budget.limit) * 100, 100)
    : 0;

  const isOverspent = budget.remaining < 0;
  const isWarning = !isOverspent && percentage >= 75;

  return (
    <Card
      className={clsx(
        styles.card,
        isOverspent && styles.cardDanger,
        isWarning && styles.cardWarning,
      )}
    >
      <div className={styles.header}>
        <div className={clsx(styles.icon, isOverspent && styles.iconDanger, isWarning && styles.iconWarning)}>
          <FiTarget aria-hidden="true" />
        </div>

        <div className={styles.actions}>
          <Button
            type="button"
            variant="ghost"
            aria-label={`Edit budget for ${budget.categoryName}`}
            onClick={() => onEdit(budget)}
          >
            <FiEdit2 aria-hidden="true" />
          </Button>

          <Button
            type="button"
            variant="danger"
            aria-label={`Delete budget for ${budget.categoryName}`}
            onClick={() => onDelete(budget)}
          >
            <FiTrash2 aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className={styles.body}>
        <div>
          <p className={styles.label}>Category</p>
          <h3 className={styles.name}>{budget.categoryName}</h3>
        </div>

        <div>
          <p className={styles.label}>Period</p>
          <p className={styles.period}>{MONTH_NAMES[budget.month - 1]} {budget.year}</p>
        </div>
      </div>

      <div className={styles.progress}>
        <div className={styles.progressBar}>
          <div
            className={clsx(
              styles.progressFill,
              isOverspent && styles.progressFillDanger,
              isWarning && styles.progressFillWarning,
            )}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={Math.round(percentage)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        <div className={styles.progressLabels}>
          <span>{formatCurrency(budget.spent)} spent</span>
          <span>{formatCurrency(budget.limit)} limit</span>
        </div>
      </div>

      <div className={clsx(styles.remaining, isOverspent && styles.remainingDanger)}>
        {isOverspent
          ? `Overspent by ${formatCurrency(Math.abs(budget.remaining))}`
          : `${formatCurrency(budget.remaining)} remaining`}
      </div>
    </Card>
  );
}
