import type { ReactNode } from "react";

import styles from "./AnalyticsGrid.module.scss";

interface AnalyticsGridProps {
  children: ReactNode;
}

export const AnalyticsGrid = ({ children }: AnalyticsGridProps) => {
    return (
        <section className={styles.analyticsGrid}>
            {children}
        </section>
    );
}