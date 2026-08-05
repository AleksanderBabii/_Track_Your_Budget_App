import { Button } from "../Button/Button";

import styles from "./EmptyState.module.scss";

interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    onActionClick?: () => void;
    }

export function EmptyState({ title, description, actionLabel, onActionClick }: EmptyStateProps) {
    return (
        <div className={styles.emptyState}>
            <h2 className={styles.title}>{title}</h2>

           {description && ( <p className={styles.description}>{description}</p> )}

            {actionLabel && onActionClick && (
                <Button onClick={onActionClick}>{actionLabel}</Button> )}
           </div>
      );
}

