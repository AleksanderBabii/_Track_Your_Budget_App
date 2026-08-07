import type { ReactNode } from "react";

import styles from "./SummaryGrid.module.scss";

interface SummaryGridProps {
    children: ReactNode;
}

export function SummaryGrid({ children }: SummaryGridProps) {
    return(
        <section className={styles.summaryGrid}>
            {children}
        </section>
    );
}