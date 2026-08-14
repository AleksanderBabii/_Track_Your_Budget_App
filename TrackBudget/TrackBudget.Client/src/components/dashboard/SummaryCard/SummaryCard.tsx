import type { ReactNode } from "react";
import clsx from "clsx";
import { formatCurrency } from "../../../utils/formatCurrency";

import styles from "./SummaryCard.module.scss";

type SummaryCardVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error";

interface SummaryCardProps {
  title: string;
  value: number;
  icon?: ReactNode;
  variant?: SummaryCardVariant;
}

export function SummaryCard({ title, value, icon, variant }: SummaryCardProps) {
  return (
    <div
      className={clsx(styles.summaryCard, {
        [styles.primary]: variant === "primary",
        [styles.secondary]: variant === "secondary",
        [styles.success]: variant === "success",
        [styles.warning]: variant === "warning",
        [styles.error]: variant === "error",
      })}
    >
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.value}>{formatCurrency(value)}</p>
    </div>
  );
}
