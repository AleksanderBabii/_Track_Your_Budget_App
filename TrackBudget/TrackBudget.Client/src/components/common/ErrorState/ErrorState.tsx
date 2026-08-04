import { Button } from "../Button"; 

import styles from "./ErrorState.module.scss";

interface ErrorStateProps {
    title?: string;
    description?: string;
    onRetry?: () => void;
    }

    export function ErrorState({ title = "Something went wrong.", 
            description = "Please try again.", 
            onRetry }: ErrorStateProps) {

        return (
            <div className={styles.errorState}>
                <h2 className={styles.title}>{title}</h2>

                <p className={styles.description}>{description}</p>
                {onRetry && (
                    <Button onClick={onRetry}>Retry</Button>
                )}
            </div>
         );
     }