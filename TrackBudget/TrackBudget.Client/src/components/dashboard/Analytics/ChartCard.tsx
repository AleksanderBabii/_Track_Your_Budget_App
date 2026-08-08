import type { PropsWithChildren } from "react";

import styles from "./ChartCard.module.scss";

interface ChartCardProps extends PropsWithChildren {
  title: string;
  description: string;
  isEmpty?: boolean;
  emptyText?: string;
}

export function ChartCard({
  title,
  description,
  isEmpty = false,
  emptyText = "No data available yet",
  children,
}: ChartCardProps) {
  return (
    <article className={styles.chartCard}>
      <header className={styles.header}>
        <h3>{title}</h3>
        <p>{description}</p>
      </header>

      <div className={styles.chartBody}>
        {isEmpty ? <div className={styles.empty}>{emptyText}</div> : children}
      </div>
    </article>
  );
}
