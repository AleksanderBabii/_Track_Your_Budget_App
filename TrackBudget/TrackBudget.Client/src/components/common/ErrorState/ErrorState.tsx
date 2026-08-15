import { Button } from "../Button/Button";

import styles from "./ErrorState.module.scss";

interface ErrorStateProps {
  message?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Something went wrong.",
  description = "Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className={styles.errorState}>
      <h2 className={styles.title}>{message}</h2>

      <p className={styles.description}>{description}</p>
      {onRetry && <Button onClick={onRetry}>Retry</Button>}
    </div>
  );
}
