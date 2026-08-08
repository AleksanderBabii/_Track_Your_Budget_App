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
                <h3 className={styles.statTitle}>Accounts</h3>
                <p className={styles.statValue}>{accountsCount}</p>
            </div>
            <div className={styles.stat}>
                <h3 className={styles.statTitle}>Categories</h3>
                <p className={styles.statValue}>{categoriesCount}</p>
            </div>
            <div className={styles.stat}>
                <h3 className={styles.statTitle}>Transactions</h3>
                <p className={styles.statValue}>{transactionsCount}</p>
            </div>
        </section>
    );
}