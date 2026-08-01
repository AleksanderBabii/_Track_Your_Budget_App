import clsx from "clsx";

import styles from "./Spinner.module.scss";

interface SpinnerProps {
  size?: "small" | "medium" | "large";
  label?: string;
  className?: string;
}

export function Spinner({ size = "medium", label, className }: SpinnerProps) {
  const accessibleLabel = label ?? "Loading";

  return (
    <span
      className={clsx(styles.wrapper, className)}
      role="status"
      aria-label={accessibleLabel}
    >
      <span className={clsx(styles.spinner, styles[size])} aria-hidden="true" />

      <span className={styles.visuallyHidden}>{accessibleLabel}</span>
    </span>
  );
}
