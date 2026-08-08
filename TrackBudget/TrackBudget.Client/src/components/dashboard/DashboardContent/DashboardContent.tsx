import type { ReactNode } from "react";

import styles from "./DashboardContent.module.scss";

interface DashboardContentProps {
    leftContent: ReactNode;
    rightContent: ReactNode;
}

export const DashboardContent = ({ leftContent, rightContent }: DashboardContentProps) => {
    return (
        <section className={styles.dashboardContent}>
            <div className={styles.leftContent}>{leftContent}</div>
            <div className={styles.rightContent}>{rightContent}</div>
        </section>
    );
}