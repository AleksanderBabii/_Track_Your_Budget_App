import type { ReactNode } from "react";

import styles from "./QuickStats.module.scss";

interface QuickStatsProps {
    accountsCount: number;
    categoriesCount: number;
    transactionsCount: number;
}

export const QuickStats = ({ accountsCount, categoriesCount, transactionsCount }: QuickStatsProps) => {
    return (
        <section className={styles.quickStats}>
            <div className={styles.stat}>
                <h3>Accounts</h3>
                <p>{accountsCount}</p>
            </div>
            <div className={styles.stat}>
                <h3>Categories</h3>
                <p>{categoriesCount}</p>
            </div>
            <div className={styles.stat}>
                <h3>Transactions</h3>
                <p>{transactionsCount}</p>
            </div>
        </section>
    );
}