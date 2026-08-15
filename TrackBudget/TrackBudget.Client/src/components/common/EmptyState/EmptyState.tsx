import { Button } from "../Button/Button";

import styles from "./EmptyState.module.scss";

interface EmptyStateProps {
  message: string;
  description: string;
  actionLabel?: string;
  onActionClick?: () => void;
}

export function EmptyState({
  message,
  description,
  actionLabel,
  onActionClick,
}: EmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      <h2 className={styles.title}>{message}</h2>

      {description && <p className={styles.description}>{description}</p>}

      {actionLabel && onActionClick && (
        <Button onClick={onActionClick}>{actionLabel}</Button>
      )}
    </div>
  );
}
