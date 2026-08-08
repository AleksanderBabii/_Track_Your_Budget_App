import type { ReactNode } from "react";
import styles from "./ChartCard.module.scss";

interface ChartCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <section className={styles.chartCard}>
      <div className={styles.header}>
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
      <div className={styles.chartContainer}>{children}</div>
    </section>
  );
}
